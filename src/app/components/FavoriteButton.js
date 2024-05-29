'use client'

import React, { useState } from 'react';
import { addToFavorites, removeFromFavorites } from '../utils/isAdmin';

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
    <button onClick={handleFavoriteClick}>
      {favorite ? 'Remove from Favorites' : 'Add to Favorites'}
    </button>
  );
};

export default FavoriteButton;
