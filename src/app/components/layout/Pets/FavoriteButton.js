'use client'

import React, { useState } from 'react';
import { addToFavorites, removeFromFavorites } from '@/app/utils/isAdmin';
import Heart from '../../icons/Heart';
import HeartAdd from '../../icons/HeartAdd';
import toast from "react-hot-toast";

const FavoriteButton = ({ userId, petId, isFavorite }) => {
  const [favorite, setFavorite] = useState(isFavorite);

  const handleFavoriteClick = async () => {
    try {
      if (favorite) {
        await removeFromFavorites(userId, petId);
      } else {
        await addToFavorites(userId, petId);
      }
      setFavorite(!favorite);
    } catch (error) {
      console.error('Error:', error);
    }
    toast.success('Pet Salvo em Favoritos!')
  };

  return (
    <div>
      <button className='p-2 border-none bg-white rounded-full' onClick={handleFavoriteClick}>
        {favorite ? <HeartAdd /> : <Heart /> }
      </button>
    </div>
    
  );
};

export default FavoriteButton;
