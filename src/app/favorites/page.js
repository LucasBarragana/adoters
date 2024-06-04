'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import FavoriteButton from '../components/FavoriteButton';
import Error from '../components/icons/Error';

const FavoritesPage = () => {
  const [favoritePets, setFavoritePets] = useState([]);
  const { data: session } = useSession();

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

  return (
    <div className='p-4 m-4 border border-white rounded-lg bg-white bg-opacity-80 backdrop-blur-lg shadow-lg relative'>
      <h1 className='text-4xl font-bold mb-4 text-gray-700 mt-10'>Favorites Page</h1>
      <div>
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
            <div className='p-4 m-4 border border-white rounded-lg bg-white bg-opacity-80 backdrop-blur-lg shadow-lg relative' key={pet._id}>
              <h2 className="text-gray-800 text-2xl">{pet.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">              
                <div>                
                  <p className="text-gray-800"><span className='font-semibold text-gray-800'>Sobre o pet:</span> {pet.description}</p>
                </div>
                <div>
                  <p className="text-gray-800 "><span className='font-semibold text-gray-800'>Cidade:</span> {pet.city}</p>
                  <p className="text-gray-800"><span className='font-semibold text-gray-800'>Categoria:</span> {pet.category}</p>
                  <p className="text-gray-800"><span className='font-semibold text-gray-800'>Porte:</span> {pet.size}</p>
                </div>
              </div>
              <p className="text-gray-800 mt-5 bottom-0 left-0">
                Abrigo: <Link href={`/user/${pet.creatorEmail}`} className="text-black font-semibold underline">{pet.creator}</Link>
              </p>
              <div className="absolute top-2 right-2">
                <FavoriteButton userId={session?.user?.email} petId={pet._id} isFavorite={pet.isFavorite} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
