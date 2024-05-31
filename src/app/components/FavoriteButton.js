'use client'

import React, { useState } from 'react';
import { addToFavorites, removeFromFavorites } from '../utils/isAdmin';
import Heart from './icons/Heart';
import HeartAdd from './icons/HeartAdd';

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
  };

  return (
    <div>
      <button className='p-2 border-none' onClick={handleFavoriteClick}>
        {favorite ? <HeartAdd /> : <Heart /> }
      </button>
    </div>
    
  );
};

export default FavoriteButton;
