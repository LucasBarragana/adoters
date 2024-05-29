'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import FavoriteButton from '../components/FavoriteButton';

const FavoritesPage = () => {
  const [favoritePets, setFavoritePets] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchFavoritePets = async () => {
      try {
        if (session) {
          if (session.user) {
            const response = await fetch(`/api/users/${session.user.email}`);
            const userData = await response.json();
            // Extrair os IDs dos pets favoritos do usuário
            const favoritePetIds = userData.favorites;
            // Buscar os detalhes dos pets favoritos
            const favoritePetsData = await Promise.all(
              favoritePetIds.map(async petId => {
                const petResponse = await fetch(`/api/pets/${petId}`);
                return await petResponse.json();
              })
            );
            setFavoritePets(favoritePetsData);
          }
        }
      } catch (error) {
        console.error('Failed to load favorite pets:', error);
      }
    };

    fetchFavoritePets();
  }, [session]);

  return (
    <div>
      <h1>Favorites Page</h1>
      <div>
        {/* Lista de pets favoritos */}
        {favoritePets.map(pet => (
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
              {/* Adicionar botão para remover dos favoritos */}
              <FavoriteButton userId={session?.user?.email} petId={pet._id} isFavorite={pet.isFavorite} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
