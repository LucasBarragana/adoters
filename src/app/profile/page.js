'use client'
import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import ProfileForm from '../components/layout/ProfileForm';

export default function UserProfile() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);

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
    <div className="max-w-lg mx-auto my-10">
      <h1 className="text-4xl font-bold mb-4 text-white">Meu Perfil</h1>
      {user ? (
        <ProfileForm userData={user} onSubmit={handleUpdate} />
      ) : (
        <p>Carregando informações do usuário...</p>
      )}
    </div>
  );
}
