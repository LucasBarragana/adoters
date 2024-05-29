'use client'

import React, { useState, useEffect } from 'react';
import cities from '@/data/cities';
import categories from '@/data/categories';
import sizes from '@/data/sizes';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import FavoriteButton from '../components/FavoriteButton'; // Importar o componente FavoriteButton

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
      <h1>Adoption Page</h1>
      {/* Filtros */}
      <div>
        <select value={filter.city} onChange={e => setFilter({ ...filter, city: e.target.value })}>
          <option value="">All Cities</option>
          {cities.map(city => (
            <option key={city.value} value={city.value}>{city.label}</option>
          ))}
        </select>
        <select value={filter.category} onChange={e => setFilter({ ...filter, category: e.target.value })}>
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.value} value={category.value}>{category.label}</option>
          ))}
        </select>
        <select value={filter.size} onChange={e => setFilter({ ...filter, size: e.target.value })}>
          <option value="">All Sizes</option>
          {sizes.map(size => (
            <option key={size.value} value={size.value}>{size.label}</option>
          ))}
        </select>
        <button onClick={applyFilter}>Apply Filter</button>
        <button onClick={clearFilter}>Clear Filter</button>
      </div>
      
      {/* Lista de pets filtrados */}
      <div>
        {filteredPets.map(pet => (
          <div className='bg-gray-400 p-4 m-4' key={pet._id}>
            <div className="border p-4 rounded">
              <h2>{pet.name}</h2>
              <p>{pet.description}</p>
              <p>City: {pet.city}</p>
              <p>Category: {pet.category}</p>
              <p>Size: {pet.size}</p>
              <p>
                Criado por: <Link href={`/user/${pet.creatorEmail}`} className="text-blue-500">{pet.creator}</Link>
              </p>
              {/* Adicionar o botão de favoritos */}
              <FavoriteButton userId={session?.user?.email} petId={pet._id} isFavorite={pet.isFavorite} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdoptionPage;
