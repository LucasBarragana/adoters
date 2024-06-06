import React, { useState } from 'react';
import { addToFavorites, removeFromFavorites } from '@/app/utils/isAdmin';
import Heart from '../../icons/Heart';
import HeartAdd from '../../icons/HeartAdd';
import toast from "react-hot-toast";

const FavoriteButton = ({ userId, petId, isFavorite, onFavoritesPage, onFavoriteRemoved, removeOnly }) => {
  const [favorite, setFavorite] = useState(isFavorite);

  const handleFavoriteClick = async () => {
    try {
      if (favorite || removeOnly) {
        await removeFromFavorites(userId, petId);
        toast.success('Pet removido dos favoritos!');
        if (onFavoritesPage) {
          onFavoriteRemoved(petId);
        }
      } else {
        await addToFavorites(userId, petId);
        toast.success('Pet salvo em favoritos!');
      }
      setFavorite(!favorite);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ocorreu um problema ao atualizar os favoritos.');
    }
  };

  return (
    <div>
      <button className='p-2 border-none bg-white rounded-full' onClick={handleFavoriteClick}>
        {removeOnly ? <Heart /> : (favorite ? <HeartAdd /> : <Heart />)}
      </button>
    </div>
  );
};

export default FavoriteButton;
