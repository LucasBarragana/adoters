'use client'

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import FavoriteButton from '@/app/components/layout/Pets/FavoriteButton';
import Error from '@/app/components/icons/Error';
import Image from 'next/image';

const FavoritesPage = () => {
  const [favoritePets, setFavoritePets] = useState([]);
  const { data: session } = useSession();
  const [showFullDescription, setShowFullDescription] = useState({});
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [selectedPetName, setSelectedPetName] = useState('');
  const [selectedPetCreatorEmail, setSelectedPetCreatorEmail] = useState('');
  const [adoptionStatus, setAdoptionStatus] = useState({});
  const [showAllDonations, setShowAllDonations] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef(null);

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

  
  useEffect(() => {
    if (session && session.user && session.user.email) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`/api/users/${session.user.email}`);
          const data = await response.json();
          setUser(data);
        } catch (err) {
          setError('Falha ao carregar usuário');
        }
      };

      const fetchPets = async () => {
        try {
          const response = await fetch(`/api/users/${session.user.email}/pets`);
          const data = await response.json();
          setPets(data);
        } catch (err) {
          setError('Falha ao carregar pets');
        }
      };

      fetchUser();
      fetchPets();
      setLoading(false);
    }
  }, [session]);

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

  const toggleDescription = (id) => {
    setShowFullDescription((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleAdoptButtonClick = (petId, petName, creatorEmail) => {
    if (!session) {
      alert('Você precisa estar logado para realizar esta ação.');
      return;
    }

    setSelectedPetId(petId);
    setSelectedPetName(petName);
    setSelectedPetCreatorEmail(creatorEmail);
    setShowConfirmationModal(true);
  };

  const handleConfirmAdoption = async () => {
    const newAdoptionStatus = { ...adoptionStatus, [selectedPetId]: { status: 'Em Analise' } };
    setAdoptionStatus(newAdoptionStatus);
    localStorage.setItem('adoptionStatus', JSON.stringify(newAdoptionStatus));
    setShowConfirmationModal(false);

    // Enviar o pedido de adoção para a API
    if (session) {
      try {
        await fetch('/api/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            petId: selectedPetId,
            petName: selectedPetName,
            adopterEmail: session.user.email,
            creatorEmail: selectedPetCreatorEmail,
          }),
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

  const countPetsForAdoption = () => {
    let count = 0;
    for (const petId in adoptionStatus) {
      if (adoptionStatus[petId].status === 'Visite/Adote') {
        count++;
      }
    }
    return count;
  };

  // Obtém o número de pets disponíveis para adoção
  const petsForAdoptionCount = countPetsForAdoption();

  // Função para abrir e fechar o popover
  const togglePopover = () => {
    setPopoverOpen(!popoverOpen);
  };

  // Função para fechar o popover quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverOpen && popoverRef.current && !popoverRef.current.contains(event.target)) {
        setPopoverOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popoverOpen]);


  if (error) {toast.error('Ocorreu um problema');}


  return (
    <div className='p-4 mt-8 border border-white rounded-lg bg-white bg-opacity-80 backdrop-blur-lg shadow-lg relative'>
      <h1 className='text-4xl font-bold mb-4 text-gray-700 mt-10'>Favorites Page</h1>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {favoritePets.length === 0 ? (
          <div className='text-center p-4 m-4 border border-white rounded-lg bg-white bg-opacity-80 backdrop-blur-lg shadow-lg relative mt-40 mb-40 pt-10 pb-10 flex flex-col justify-center items-center'>
            <Error />
            <p className='text-2xl mt-4'>Você não tem nenhum pet favorito ainda.</p>
            <Link href="/pages/adoption" className='text-gray-800 underline font-semibold mt-2'>
              Veja os pets disponíveis para adoção aqui
            </Link>
          </div>        
        ) : (
          favoritePets.map(pet => (
            <div className="p-2 border border-white rounded-lg bg-white bg-opacity-80 backdrop-blur-lg shadow-lg relative" key={pet._id}>
                <div>
                  <Image className="rounded-md" src={pet.image} alt={"petImage"} width={200} height={200} />
                </div>
                <h2 className="text-gray-800 text-2xl">{pet.name}</h2>
                <div className="mt-2">
                  <div>
                    <p className="text-gray-800">
                      <span className="font-semibold text-gray-800">Sobre o pet:</span> <br />
                      {showFullDescription[pet._id] ? pet.description : formatDescription(pet.description)}
                      {pet.description.length > 40 && (
                        <span className="text-blue-500 cursor-pointer" onClick={() => toggleDescription(pet._id)}>
                          {showFullDescription[pet._id] ? ' [ver menos]' : ' [ver mais]'}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex mt-2 text-sm gap-4">
                    <p className="text-gray-800"><span className="font-semibold text-gray-800">Cidade:</span> {pet.city}</p>
                    <p className="text-gray-800"><span className="font-semibold text-gray-800">Categoria:</span> {pet.category}</p>
                    <p className="text-gray-800"><span className="font-semibold text-gray-800">Porte:</span> {pet.size}</p>
                  </div>
                </div>
                <p className="text-gray-800 mt-5 bottom-0 left-0">
                  Abrigo: <Link href={`/pages/users/user/${pet.creatorEmail}`} className="text-black font-semibold underline">{pet.creator}</Link>
                </p>
                <div className="w-full bg-secundary text-white cursor-pointer flex justify-center align-center rounded-lg mt-4">
                  <button
                    onClick={() => handleAdoptButtonClick(pet._id, pet.name, pet.creatorEmail)}
                    className={`${
                      adoptionStatus[pet._id] && adoptionStatus[pet._id].status === 'Em Analise'
                        ? 'disabled'
                        : ''
                    } ${
                      adoptionStatus[pet._id] && adoptionStatus[pet._id].status === 'Em Analise' ? 'text-gray-700' : 'text-white'
                    }`} 
                    disabled={
                      adoptionStatus[pet._id] && adoptionStatus[pet._id].status === 'Em Analise'
                    }
                  >
                    {adoptionStatus[pet._id] && adoptionStatus[pet._id].status === 'Em Analise'
                      ? 'Em Análise'
                      : 'Visite/Adote'}
                  </button>
                </div>
                <div className="absolute top-2 right-2">
                  <FavoriteButton userId={session?.user?.email} petId={pet._id} isFavorite={pet.isFavorite} />
                </div>
              </div>
          ))
        )}
      </div>
      
      {/* Modal de confirmação */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h1 className="font-semibold text-secondary">UHULL, QUE FELICIDADE!</h1>
            <p className="text-gray-800 mb-4">
              Oi, me chamo {selectedPetName}, estou ansioso(a) para te conhecer e te encher de amor. Caso tenha certeza que me quer, clique em{' '}
              <span className="font-semibold text-secondary">Sim</span> e vou te esperar por <span className="font-semibold text-secondary">24h</span>.
            </p>
            <div className="flex justify-end">
              <button onClick={handleConfirmAdoption} className="bg-green-500 text-white p-2 rounded mr-2">
                Sim
              </button>
              <button onClick={handleCancelAdoption} className="bg-gray-500 text-white p-2 rounded">
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de doações */}
      {popoverOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div ref={popoverRef} className="bg-white p-6 rounded-lg shadow-lg">
            <ul className="space-y-2">
              <p className="text-2xl font-semibold">Doações que precisamos:</p>
              {user.donations.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}


export default FavoritesPage;

