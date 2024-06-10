'use client'

import React, { useState, useEffect } from 'react';
import DonationListPage from '@/app/components/layout/Users/DonationListPage';
import OpeningHours from '@/app/components/layout/Users/OpeningHours';
import { useSession, signIn } from 'next-auth/react';

const UserProfilePage = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (session) {
      fetch(`/api/users/${session.user.email}`)
        .then(res => res.json())
        .then(data => setUserData(data))
        .catch(error => console.error('Erro ao buscar usuário:', error));
    }
  }, [session]);

  async function handleProfileSubmit (updatedUser) {
    // Update user data in your backend
    fetch(`/api/users/${session.user.email}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    })
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(error => console.error('Erro ao atualizar usuário:', error));      
      
  };  

  const handleDonationsChange = (newDonations) => {
    const updatedUser = { ...userData, donations: newDonations };
    handleProfileSubmit(updatedUser);
  };

  const handleOpeningHoursChange = (newOpeningHours) => {
    const updatedUser = { ...userData, openingHours: newOpeningHours };
    handleProfileSubmit(updatedUser);
  };

  if (!session) {
    return (
      <div className="text-center p-10">
        <p className="text-2xl">Você precisa estar logado para ver seus pets.</p>
        <button onClick={() => signIn("google")} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 mt-4">
          Entrar com Google
        </button>
      </div>
    );
  }

  return (
    <div className="p-10">
      {userData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className='p-4 border border-white rounded-lg bg-white bg-opacity-80 backdrop-blur-lg shadow-lg relative'>
              <DonationListPage donations={userData.donations} onDonationsChange={handleDonationsChange} />
            </div>
          </div>
          <div>
            <div className='p-4 border border-white rounded-lg bg-white bg-opacity-80 backdrop-blur-lg shadow-lg relative'>
              <OpeningHours openingHours={userData.openingHours} onOpeningHoursChange={handleOpeningHoursChange} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
