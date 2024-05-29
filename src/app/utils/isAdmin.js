// utils/isAdmin.js
import { getSession } from 'next-auth/react';

export async function isAdmin() {
  const session = await getSession();
  if (!session) {
    return false;
  }

  try {
    const res = await fetch(`/api/users/${session.user.email}`);
    const user = await res.json();
    return user.admin === true;
  } catch (error) {
    console.error('Erro ao verificar se o usuário é admin:', error);
    return false;
  }
}

// Lógica para adicionar um pet aos favoritos
export async function addToFavorites(userId, petId) {
  const response = await fetch(`/api/users/${userId}/favorites/${petId}`, {
    method: 'POST',
  });
  const data = await response.json();
  console.log(data);
  // Atualizar a interface do usuário conforme necessário
}

// Lógica para remover um pet dos favoritos
export async function removeFromFavorites(userId, petId) {
  const response = await fetch(`/api/users/${userId}/favorites/${petId}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  console.log(data);
  // Atualizar a interface do usuário conforme necessário
}
