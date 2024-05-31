'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import FavoriteButton from '@/app/components/FavoriteButton';
import { useSession } from 'next-auth/react';

export default function UserPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`/api/users/${id}`);
          const data = await response.json();
          setUser(data);
        } catch (err) {
          setError('Falha ao carregar usuário');
        }
      };

      const fetchPets = async () => {
        try {
          const response = await fetch(`/api/users/${id}/pets`);
          const data = await response.json();
          setPets(data);
        } catch (err) {
          setError('Falha ao carregar pets');
        }
      };

      fetchUser();
      fetchPets();
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="mt-10">
      <div className='absolute right-40 top-50'>
        <div className='flex gap-4 p-4 border border-white rounded-lg bg-white bg-opacity-80 backdrop-blur-lg shadow-lg'>
          <div className="flex flex-col items-center text-blue-800">
            <p className="text-xs">ADOTADOS</p>
            <p className="text-4xl font-bold">23</p>
          </div>
          <div className="h-12 w-px bg-gray-400 " ></div>
          <div className="flex flex-col items-center text-red-700">
            <p className="text-xs">Para adoção</p>
            <p className="text-4xl font-bold">23</p>
          </div>
        </div>        
      </div>
      <div className='text-white'>
        <h1 className="text-4xl font-bold mb-4">Abrigo {user?.name}</h1>
        <p className='text-2xl mb-4'>Informações:</p>
        <p className='mb-2'>Email: {user?.email}</p>
        <p className='mb-2'>Endereço: {user?.address}</p>
        <p className='mb-2'>Telefone: {user?.phoneNumber}</p>
        <p className='mb-2'>Cidade: {user?.city}</p>
      </div>
      
      <div className='mt-8'>
        <h2 className="text-2xl font-bold mb-4 text-white">Pets para adoção neste abrigo:</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {pets.length > 0 ? (
            pets.map(pet => (
              <div className='p-4 m-4 border border-white rounded-lg bg-white bg-opacity-80 backdrop-blur-lg shadow-lg relative' key={pet._id}>
                <h2 className="text-gray-800 text-2xl">{pet.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">              
                  <div>                
                    <p className="text-gray-800"><p className='font-semibold text-gray-800'>Sobre o pet:</p> {pet.description}</p>
                  </div>
                  <div>
                    <p className="text-gray-800 "><p className='font-semibold text-gray-800'>Cidade:</p> {pet.city}</p>
                    <p className="text-gray-800"><p className='font-semibold text-gray-800'>Categoria:</p> {pet.category}</p>
                    <p className="text-gray-800"><p className='font-semibold text-gray-800'>Porte:</p> {pet.size}</p>
                  </div>
                </div>
                <p className="text-gray-800 mt-5  bottom-0 left-0">
                  Abrigo: <Link href={`/user/${pet.creatorEmail}`} className="text-black font-semibold underline">{pet.creator}</Link>
                </p>
                <div className="absolute top-2 right-2">
                  <FavoriteButton userId={session?.user?.email} petId={pet._id} isFavorite={pet.isFavorite} />
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum pet criado por este usuário.</p>
          )}
        </div>        
      </div>
    </div>
  );
}
