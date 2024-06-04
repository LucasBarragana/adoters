'use client';

import React, { useState, useEffect } from 'react';
import DonationListPage from '../components/layout/DonationListPage';
import OpeningHours from '../components/layout/OpeningHours';
import { useSession } from 'next-auth/react';

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

  const handleProfileSubmit = (updatedUser) => {
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
    return <p>Carregando...</p>;
  }

  return (
    <div className="p-10">
      {userData && (
        <>
        <div className='p-4 m-4 border border-white rounded-lg bg-white bg-opacity-80 backdrop-blur-lg shadow-lg relative'>
          <DonationListPage donations={userData.donations} onDonationsChange={handleDonationsChange} />
        </div>
        <div className='p-4 m-4 border border-white rounded-lg bg-white bg-opacity-80 backdrop-blur-lg shadow-lg relative'>
          <OpeningHours openingHours={userData.openingHours} onOpeningHoursChange={handleOpeningHoursChange} />
        </div >  
          
        </>
      )}
    </div>
  );
};

export default UserProfilePage;
