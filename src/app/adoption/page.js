'use client'

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

const AdoptionPage = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [filter, setFilter] = useState({ city: '', category: '', size: '' });
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
                  <span className='font-semibold text-gray-800'>Sobre o pet:</span> <br/>
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
              <Link href='#' className=''>Agendar Visita</Link>
            </div>
            <div className="absolute top-2 right-2">
              <FavoriteButton userId={session?.user?.email} petId={pet._id} isFavorite={pet.isFavorite} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdoptionPage;
