'use client';

import React, { useState, useEffect } from 'react';
import cities from '@/data/cities';
import categories from '@/data/categories';
import sizes from '@/data/sizes';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import FavoriteButton from '../components/FavoriteButton';
import Lupa from '../components/icons/Lupa';
import Refresh from '../components/icons/Refresh';
import Image from 'next/image';
import { useRouter } from 'next/router';

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
  const router = useRouter();

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
      <h1 className='text-4xl font-semibold text-white mt-10 mb-10'>Página De Adoção</h1>
      {/* Filtros */}
      <div className='flex gap-4'>
        <div>
          <label className='text-white' htmlFor="city">Cidade</label>
          <select value={filter.city} onChange={e => setFilter({ ...filter, city: e.target.value })}>
            <option value="">Cidades</option>
            {cities.map(city => (
              <option key={city.value} value={city.value}>{city.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className='text-white' htmlFor="category">Categoria</label>
          <select value={filter.category} onChange={e => setFilter({ ...filter, category: e.target.value })}>
            <option value="">Categorias</option>
            {categories.map(category => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className='text-white' htmlFor="size">Porte</label>
          <select value={filter.size} onChange={e => setFilter({ ...filter, size: e.target.value })}>
            <option value="">Portes</option>
            {sizes.map(size => (
              <option key={size.value} value={size.value}>{size.label}</option>
            ))}
          </select>
        </div>
        <div className='flex items-end p-2 gap-4'>
          <button className='bg-white p-2 ' onClick={applyFilter}><Lupa /></button>
          <button className='bg-white p-2 ' onClick={clearFilter}><Refresh /></button>
        </div>
      </div>

      {/* Lista de pets filtrados */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {filteredPets.map(pet => (
          <div className='p-4 m-4 border border-white rounded-lg bg-white bg-opacity-80 backdrop-blur-lg shadow-lg relative' key={pet._id}>
            <div>
              <Image className="rounded-md" src={pet.image} alt={"petImage"} width={200} height={200} />
            </div>
            <h2 className="text-gray-800 text-2xl">{pet.name}</h2>
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
              <div className='flex mt-2 text-sm gap-4'>
                <p className="text-gray-800"><span className='font-semibold text-gray-800'>Cidade:</span> {pet.city}</p>
                <p className="text-gray-800"><span className='font-semibold text-gray-800'>Categoria:</span> {pet.category}</p>
                <p className="text-gray-800"><span className='font-semibold text-gray-800'>Porte:</span> {pet.size}</p>
              </div>
            </div>
            <p className="text-gray-800 mt-5  bottom-0 left-0">
              Abrigo: <Link href={`/user/${pet.creatorEmail}`} className="text-black font-semibold underline">{pet.creator}</Link>
            </p>
            <div className='w-full bg-secundary text-white cursor-pointer flex justify-center align-center rounded-lg mt-4'>
              <button
                onClick={() => handleAdoptButtonClick(pet._id, pet.name, pet.creatorEmail)}
                className={`${
                  adoptionStatus[pet._id] && adoptionStatus[pet._id].status === 'Em Analise'
                    ? 'disable'
                    : ''
                } ${adoptionStatus[pet._id] && adoptionStatus[pet._id].status === 'Em Analise' ? 'text-gray-700' : 'text-white'}`} // Adiciona a classe "text-gray-700" quando o botão estiver desativado
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h1 className='font-semibold text-secundary'>UHULL, QUE FELICIDADE!</h1>
            <p className="text-gray-800 mb-4">Oi, me chamo {selectedPetName}, estou ansioso(a) para te conhecer e te encher de amor. Caso tenha certeza que me quer, click em <span className='font-semibold text-secundary'>Sim</span>  e vou te esperar por <span className='font-semibold text-secundary'>24h</span>.</p>
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

export default AdoptionPage;
