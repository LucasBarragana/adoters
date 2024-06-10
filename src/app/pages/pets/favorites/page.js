'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import FavoriteButton from '@/app/components/layout/Pets/FavoriteButton';
import Error from '@/app/components/icons/Error';
import Image from 'next/image';
import toast from "react-hot-toast";

const FavoritesPage = () => {
  const [favoritePets, setFavoritePets] = useState([]);
  const { data: session } = useSession();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [selectedPetName, setSelectedPetName] = useState('');
  const [selectedPetCreatorEmail, setSelectedPetCreatorEmail] = useState('');
  const [adoptionStatus, setAdoptionStatus] = useState({});


  useEffect(() => {
    const fetchFavoritePets = async () => {
      try {
        if (session && session.user) {
          const response = await fetch(`/api/users/${session.user.email}`);
          const userData = await response.json();
          const favoritePetIds = userData.favorites;

          const favoritePetsData = await Promise.all(
            favoritePetIds.map(async petId => {
              const petResponse = await fetch(`/api/pets/${petId}`);
              return await petResponse.json();
            })
          );
          setFavoritePets(favoritePetsData);
        }
      } catch (error) {
        console.error('Failed to load favorite pets:', error);
      }
    };
    fetchFavoritePets();
  }, [session]);

  const handleFavoriteRemoved = (petId) => {
    setFavoritePets(favoritePets.filter(pet => pet._id !== petId));
  };


  useEffect(() => {
    const storedAdoptionStatus = localStorage.getItem('adoptionStatus');
    if (storedAdoptionStatus) {
      setAdoptionStatus(JSON.parse(storedAdoptionStatus));
    }
  }, []);

  const formatDescription = (description, maxLength = 40) => {
    if (description.length <= maxLength) {
      return description;
    }
    return `${description.slice(0, maxLength)}...`;
  };

  const [showFullDescription, setShowFullDescription] = useState({});

  const toggleDescription = (id) => {
    setShowFullDescription(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleAdoptButtonClick = (petId, petName, creatorEmail) => {
    if (!session) {
      <div>
        <p>Você precisa estar logado para realizar esta ação.</p>
      </div>;
      return;
    }

    setSelectedPetId(petId);
    setSelectedPetName(petName);
    setSelectedPetCreatorEmail(creatorEmail);
    setShowConfirmationModal(true);
  };

  const handleConfirmAdoption = async () => {
    const newAdoptionStatus = { ...adoptionStatus, [selectedPetId]: { status: 'Em Analise'} };
    setAdoptionStatus(newAdoptionStatus);
    localStorage.setItem('adoptionStatus', JSON.stringify(newAdoptionStatus));
    setShowConfirmationModal(false);

    // Enviar o pedido de adoção para a API
    if (session) {
      try {
        await fetch('/api/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            petId: selectedPetId,
            petName: selectedPetName,
            adopterEmail: session.user.email,
            creatorEmail: selectedPetCreatorEmail
          })
        });
      } catch (error) {
        console.error('Failed to submit adoption request:', error);
      }
      await toast.promise(handleConfirmAdoption, {
        loading: 'Enviando...',
        success: 'Pedido Enviado com Sucesso',
        error: 'Ocorreu um problema',
      });
    }

    // Lógica para esperar 24 horas e atualizar o status do pet
    setTimeout(() => {
      const updatedAdoptionStatus = { ...adoptionStatus };
      delete updatedAdoptionStatus[selectedPetId];
      setAdoptionStatus(updatedAdoptionStatus);
      localStorage.setItem('adoptionStatus', JSON.stringify(updatedAdoptionStatus));
    }, 24 * 60 * 60 * 1000); // 24 horas
  };

  const handleCancelAdoption = () => {
    setShowConfirmationModal(false);
  };
  return (
    <div>
        <h1 className='text-4xl font-bold mb-4 text-white mt-10'>Favorites Page</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">'>
          {/* Verificação se há pets favoritos */}
          {favoritePets.length === 0 ? (
            <div className='text-center p-4 m-4 border border-white rounded-lg bg-white bg-opacity-80 backdrop-blur-lg shadow-lg relative mt-40 mb-40 pt-10 pb-10 flex flex-col justify-center items-center'>
              <Error />
              <p className='text-2xl mt-4'>Você não tem nenhum pet favorito ainda.</p>
              <Link href="/adoption" className='text-gray-800 underline font-semibold mt-2'>
                Veja os pets disponíveis para adoção aqui
              </Link>
            </div>        
          ) : (
            favoritePets.map(pet => (
              <div className='p-4 border border-white rounded-lg bg-white bg-opacity-80 backdrop-blur-lg shadow-lg relative' key={pet._id}>
            <div className="w-full h-40 overflow-hidden rounded-md flex justify-center items-center">
              <Image className="object-cover w-full h-full" src={pet.image} alt="petImage" width={160} height={160} />
            </div>
            <h2 className="text-gray-850 text-2xl mt-2">{pet.name}</h2>
            <div className="mt-2">
              <div>
                <p className="text-gray-850">
                  <span className='font-semibold text-gray-850'>Sobre o pet:</span> <br />
                  {showFullDescription[pet._id] ? pet.description : formatDescription(pet.description)}
                  {pet.description.length > 40 && (
                    <span className="text-blue-500 cursor-pointer" onClick={() => toggleDescription(pet._id)}>
                      {showFullDescription[pet._id] ? ' [ver menos]' : ' [ver mais]'}
                    </span>
                  )}
                </p>
              </div>
              <div className='flex justify-between gap-4 mt-2 text-sm'>
                <p className="text-gray-850"><span className='font-semibold text-gray-850'>Cidade:</span> <br></br>{pet.city}</p>
                <p className="text-gray-850"><span className='font-semibold text-gray-850'>Categoria:</span><br></br> {pet.category}</p>
                <p className="text-gray-850"><span className='font-semibold text-gray-850'>Porte:</span><br></br> {pet.size}</p>
              </div>
            </div>
            <p className="text-gray-850 mt-5">
              Abrigo: <Link href={`/pages/users/userPage/${pet.creatorEmail}`} className="text-black font-semibold underline">{pet.creator}</Link>
            </p>
            <div className='w-full bg-secundary text-white cursor-pointer flex justify-center align-center rounded-lg mt-4'>
              <button
                onClick={() => handleAdoptButtonClick(pet._id, pet.name, pet.creatorEmail)}
                className={`${
                  adoptionStatus[pet._id] && adoptionStatus[pet._id].status === 'Em Analise'
                    ? 'disable'
                    : ''
                } ${adoptionStatus[pet._id] && adoptionStatus[pet._id].status === 'Em Analise' ? 'text-gray-700' : 'text-white'}`} 
                disabled={
                  adoptionStatus[pet._id] && adoptionStatus[pet._id].status === 'Em Analise'
                }
              >
                {adoptionStatus[pet._id] && adoptionStatus[pet._id].status === 'Em Analise'
                  ? 'Em Analise'
                  : 'Visite/Adote'}
              </button>
            </div>
            <div className="absolute top-2 right-2">
                  <FavoriteButton
                    userId={session?.user?.email}
                    petId={pet._id}
                    isFavorite={pet.isFavorite}
                    onFavoritesPage={true}
                    onFavoriteRemoved={handleFavoriteRemoved}
                    removeOnly={true} // Passa a nova propriedade para indicar que o botão é apenas para remoção
                  />
                </div>
          </div>
              ))
            )}
        </div>
        {/* Modal de confirmação */}
      {showConfirmationModal && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-full mx-4 sm:bg-white p-6 rounded-lg shadow-lg w-80 mx-4">
          <div className='flex justify-center align-center gap-2'>
            <h1 className='font-semibold text-secundary'>UHULL, QUE FELICIDADE!</h1>
            <Image className="" src="/festa.png" alt="petImage" width={36} height={26} />
          </div>          
          <p className="text-gray-850 mb-4">
            Oi, me chamo {selectedPetName}, estou ansioso(a) para te conhecer e te encher de amor. 
            Caso tenha certeza que me quer, clique em <span className='font-semibold text-secundary'>Sim</span> e vou te esperar por 
            <span className='font-semibold text-secundary'>24h</span>.
          </p>
          <div className="flex justify-end">
            <button onClick={handleConfirmAdoption} className="bg-green-500 text-white p-2 rounded mr-2">Sim</button>
            <button onClick={handleCancelAdoption} className="bg-gray-500 text-white p-2 rounded">Voltar</button>
          </div>
        </div>
      </div>
    )}
    </div>
    );
  };

  export default FavoritesPage;