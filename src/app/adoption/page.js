'use client'

import { useState, useEffect } from 'react';
import cities from '@/data/cities';
import categories from '@/data/categories';
import sizes from '@/data/sizes';

const AdoptionPage = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [filter, setFilter] = useState({ city: '', category: '', size: '' });

  // Carregar os dados de pets usando fetch
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch('/api/pets');
        const data = await response.json();
        setPets(data);
        setFilteredPets(data); // Inicializar filteredPets com todos os pets
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
            <h2>{pet.name}</h2>
            <p>{pet.description}</p>
            <p>City: {pet.city}</p>
            <p>Category: {pet.category}</p>
            <p>Size: {pet.size}</p>
            {/* Outras informações do pet */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdoptionPage;
