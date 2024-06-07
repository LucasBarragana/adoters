'use client';

import React, { useState, useEffect } from 'react';
import cities from '@/app/data/cities';
import categories from '@/app/data/categories';
import sizes from '@/app/data/sizes';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import FavoriteButton from '@/app/components/layout/Pets/FavoriteButton';
import Lupa from '@/app/components/icons/Lupa';
import Refresh from '@/app/components/icons/Refresh';
import Image from 'next/image';
import toast from "react-hot-toast";

const AdoptionPage = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [filter, setFilter] = useState({ city: '', category: '', size: '' });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [selectedPetName, setSelectedPetName] = useState('');
  const [selectedPetCreatorEmail, setSelectedPetCreatorEmail] = useState('');
  const [adoptionStatus, setAdoptionStatus] = useState({});
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch('/api/pets');
        const data = await response.json();
        setPets(data);
        setFilteredPets(data);
      } catch (error) {
        console.error('Failed to load pets:', error);
      }
    };

    fetchPets();
  }, []);

  useEffect(() => {
    const storedAdoptionStatus = localStorage.getItem('adoptionStatus');
    if (storedAdoptionStatus) {
      setAdoptionStatus(JSON.parse(storedAdoptionStatus));
    }
  }, []);

  const applyFilter = () => {
    const filtered = pets.filter(pet => {
      if (filter.city && pet.city !== filter.city) return false;
      if (filter.category && pet.category !== filter.category) return false;
      if (filter.size && pet.size !== filter.size) return false;
      return true;
    });
    setFilteredPets(filtered);
  };

  const clearFilter = () => {
    setFilter({ city: '', category: '', size: '' });
    setFilteredPets(pets);
  };

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
    <section id="" className="mt-8 md:mt-4 relative px-4 sm:px-6 lg:px-8">      
      <h1 className='text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mt-10 mb-5'>Página De Adoção</h1>
      {/* Filtros */}
      <div className='block gap-4 sm:flex gap-4 md:flex gap-4 lg:flex gap-4'>
        <div className='flex gap-4'>
          <div>
            <label className='text-white' htmlFor="city">Cidade</label>
            <select
              className='mt-1 block w-full p-2 bg-white text-gray-800 border border-gray-300 rounded-md'
              value={filter.city}
              onChange={e => setFilter({ ...filter, city: e.target.value })}
            >
              <option value="">Cidades</option>
              {cities.map(city => (
                <option key={city.value} value={city.value}>{city.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className='text-white' htmlFor="category">Categoria</label>
            <select
              className='mt-1 block w-full p-2 bg-white text-gray-800 border border-gray-300 rounded-md'
              value={filter.category}
              onChange={e => setFilter({ ...filter, category: e.target.value })}
            >
              <option value="">Categorias</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className='text-white' htmlFor="size">Porte</label>
            <select
              className='mt-1 block w-full p-2 bg-white text-gray-800 border border-gray-300 rounded-md'
              value={filter.size}
              onChange={e => setFilter({ ...filter, size: e.target.value })}
            >
              <option value="">Portes</option>
              {sizes.map(size => (
                <option key={size.value} value={size.value}>{size.label}</option>
              ))}
            </select>
          </div>          
        </div>  
        <div className='flex justify-end align-end'>
          <div className='flex items-center gap-4'>
            <button className='bg-white p-2 rounded-md sm:bg-white p-2 rounded-md md:bg-white p-2 rounded-md lg:bg-white p-2 rounded-md' onClick={applyFilter}><Lupa /></button>
            <button className='bg-white p-2 rounded-md sm:bg-white p-2 rounded-md md:bg-white p-2 rounded-md lg:bg-white p-2 rounded-md' onClick={clearFilter}><Refresh /></button>
          </div>
        </div>      
      </div>

      {/* Lista de pets filtrados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {filteredPets.map(pet => (
          <div className='p-4 border border-white rounded-lg bg-white bg-opacity-80 backdrop-blur-lg shadow-lg relative' key={pet._id}>
            <div className="w-full h-40 overflow-hidden rounded-md flex justify-center items-center">
              <Image className="object-cover w-full h-full" src={pet.image} alt="petImage" width={160} height={160} />
            </div>
            <h2 className="text-gray-800 text-2xl mt-2">{pet.name}</h2>
            <div className="mt-2">
              <div>
                <p className="text-gray-800">
                  <span className='font-semibold text-gray-800'>Sobre o pet:</span> <br />
                  {showFullDescription[pet._id] ? pet.description : formatDescription(pet.description)}
                  {pet.description.length > 40 && (
                    <span className="text-blue-500 cursor-pointer" onClick={() => toggleDescription(pet._id)}>
                      {showFullDescription[pet._id] ? ' [ver menos]' : ' [ver mais]'}
                    </span>
                  )}
                </p>
              </div>
              <div className='flex justify-between gap-4 mt-2 text-sm'>
                <p className="text-gray-800"><span className='font-semibold text-gray-800'>Cidade:</span> <br></br>{pet.city}</p>
                <p className="text-gray-800"><span className='font-semibold text-gray-800'>Categoria:</span><br></br> {pet.category}</p>
                <p className="text-gray-800"><span className='font-semibold text-gray-800'>Porte:</span><br></br> {pet.size}</p>
              </div>
            </div>
            <p className="text-gray-800 mt-5">
              Abrigo: <Link href={`/pages/users/user/${pet.creatorEmail}`} className="text-black font-semibold underline">{pet.creator}</Link>
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
              <FavoriteButton userId={session?.user?.email} petId={pet._id} isFavorite={pet.isFavorite} />
            </div>
          </div>
        ))}
      </div>
      {/* Modal de confirmação */}
      {showConfirmationModal && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-full mx-4 sm:bg-white p-6 rounded-lg shadow-lg w-80 mx-4">
          <div className='flex justify-center align-center gap-2'>
            <h1 className='font-semibold text-secundary'>UHULL, QUE FELICIDADE!</h1>
            <Image className="" src="/festa.png" alt="petImage" width={36} height={26} />
          </div>          
          <p className="text-gray-800 mb-4">
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
    </section>
  );
};

export default AdoptionPage;
