'use client'
import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import ProfileForm from '../components/layout/ProfileForm';
import Link from 'next/link';
import { isAdmin } from "@/app/utils/isAdmin";

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
      alert('Perfil atualizado com sucesso!');
      const updatedData = await res.json();
      setUser(updatedData);
    } else {
      const errorData = await res.json();
      alert(`Erro: ${errorData.message}`);
    }
  };

  if (status === 'loading') {
    return <p>Carregando...</p>;
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
      <div className='flex justify-between items-center text-gray-700 max-w-lg mx-auto my-10'>
        <h1 className="text-4xl font-bold mb-4 ">Meu Perfil</h1>
        {admin && (
        <div>
          <p className='text-sm mb-1'>Doações/Horários</p>
          <Link href="/info-shelter" className='bg-secundary text-white rounded-lg font-2xl p-2 cursor-pointer'>Info. Adicionais do Abrigo</Link>
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
