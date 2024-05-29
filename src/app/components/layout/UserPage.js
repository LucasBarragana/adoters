'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserPage() {
  const router = useRouter();
  const { email } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (email) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`/api/users/${email}`);
          const data = await response.json();
          setUser(data);
        } catch (err) {
          setError('Falha ao carregar usuário');
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [email]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-lg mx-auto my-10">
      <h1 className="text-2xl font-bold mb-4">Informações do Usuário</h1>
      <p>Nome: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Endereço: {user.address} </p>
      <p>Telefone: {user.phoneNumber} </p>
      <p>Cidade: {user.city} </p>
      <p>Admin: {user.admin ? 'Sim' : 'Não'}</p>
      {/* Outras informações do usuário */}
    </div>
  );
}
