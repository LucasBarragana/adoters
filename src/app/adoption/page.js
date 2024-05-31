'use client';

import React, { useState, useEffect } from 'react';
import cities from '@/data/cities';
import categories from '@/data/categories';
import sizes from '@/data/sizes';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import FavoriteButton from '../components/FavoriteButton'; // Importar o componente FavoriteButton
import Lupa from '../components/icons/Lupa';
import Refresh from '../components/icons/Refresh';

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
            <h2 className="text-gray-800 text-2xl">{pet.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">              
              <div>                
                <p className="text-gray-800"><p className='font-semibold text-gray-800'>Sobre o pet:</p> {pet.description}</p>
              </div>
              <div>
                <p className="text-gray-800 "><p className='font-semibold text-gray-800'>Cidade:</p> {pet.city}</p>
                <p className="text-gray-800"><p className='font-semibold text-gray-800'>Categoria:</p> {pet.category}</p>
                <p className="text-gray-800"><p className='font-semibold text-gray-800'>Porte:</p> {pet.size}</p>
              </div>
            </div>
            <p className="text-gray-800 mt-5  bottom-0 left-0">
              Abrigo: <Link href={`/user/${pet.creatorEmail}`} className="text-black font-semibold underline">{pet.creator}</Link>
            </p>
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



          