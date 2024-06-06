'use client'

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import ProfileForm from '@/app/components/layout/Users/ProfileForm';
import Link from 'next/link';
import { isAdmin } from '@/app/utils/isAdmin';
import toast from "react-hot-toast";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);
  
  useEffect(() => {
    async function checkAdmin() {
      const isAdminUser = await isAdmin();
      setAdmin(isAdminUser);
    }
    checkAdmin();
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch(`/api/users/${session.user.email}`)
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(error => console.error('Erro ao buscar usuário:', error));
    }
  }, [status, session]);

  const handleUpdate = async (updatedUser) => {
    const res = await fetch(`/api/users/${session.user.email}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    });

    if (res.ok) {
      toast.success('Perfil atualizado com sucesso!');
      const updatedData = await res.json();
      setUser(updatedData);
    } else {
      const errorData = await res.json();
      toast.error(`Erro: ${errorData.message}`);
    }
  };

  if (status === 'loading') {
    toast.loading('Carregando...');
  }

  if (status === 'unauthenticated') {
    return (
      <div>
        <p>Você precisa estar logado para ver seu perfil.</p>
        <button onClick={() => signIn('google')}>Entrar com Google</button>
      </div>
    );
  }

  return (
    <div className="my-10 p-4 m-4 border border-white rounded-lg bg-white bg-opacity-80 backdrop-blur-lg shadow-lg">
      <div className='block sm:flex justify-center align-center mt-4 items-center text-gray-700'>
        <h1 className="text-4xl font-bold mb-4">Meu Perfil</h1>
        {admin && (
          <div className="ml-4">
            <p className='text-sm mb-1'>Doações/Horários</p>
            <Link href="/pages/users/info-shelter" className='bg-secundary text-white rounded-lg font-2xl p-2 cursor-pointer '>Info. Adicionais do Abrigo</Link>
          </div>
        )}
      </div>
      
      {user ? (
        <ProfileForm userData={user} onSubmit={handleUpdate} />
      ) : (
        <p>Carregando informações do usuário...</p>
      )}
    </div>
  );
}
