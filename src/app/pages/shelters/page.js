'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Lupa from '@/app/components/icons/Lupa';
import Refresh from '@/app/components/icons/Refresh';
import cities from '@/app/data/cities';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filter, setFilter] = useState({ city: '', category: '', size: '' });

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const userData = await response.json();
        console.log('UserData:', userData); // Adicionando console log para visualizar os dados retornados
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.message);
      }
    }

    getUsers();
  }, []);

  const applyFilter = () => {
    const filtered = users.filter(user => {
      if (filter.city && user.city !== filter.city) return false;
      return true;
    });
    setFilteredUsers(filtered);
  };

  const clearFilter = () => {
    setFilter({ city: ''});
    setFilteredUsers(pets);
  };

  if (error) {
    return <div className="">Error: {error}</div>;
  }

  return (
    <div>
        <h1 className="text-4xl text-white font-bold my-8">Abrigos Cadastrados</h1>
        <div className='block gap-4 sm:flex gap-4 md:flex gap-4 lg:flex gap-4'>
            <div className='flex gap-4'>
                <div>
                    <label className='text-white' htmlFor="city">Cidade</label>
                    <select
                    className='mt-1 block w-full p-2 bg-white text-gray-850 border border-gray-300 rounded-md'
                    value={filter.city}
                    onChange={e => setFilter({ ...filter, city: e.target.value })}
                    >
                    <option value="">Cidades</option>
                    {cities.map(city => (
                        <option key={city.value} value={city.value}>{city.label}</option>
                    ))}
                    </select>
                </div>   
                <div className='flex items-end gap-4 mb-2'>
                    <button className='bg-white p-2 rounded-md sm:bg-white p-2 rounded-md md:bg-white p-2 rounded-md lg:bg-white p-2 rounded-md' onClick={applyFilter}><Lupa /></button>
                    <button className='bg-white p-2 rounded-md sm:bg-white p-2 rounded-md md:bg-white p-2 rounded-md lg:bg-white p-2 rounded-md' onClick={clearFilter}><Refresh /></button>
                </div>
            </div>      
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {users.map(user => (
                <div className='p-4 border border-white rounded-lg bg-white bg-opacity-80 backdrop-blur-lg shadow-lg relative hover:bg-white' key={user._id}>
                    <Link href={`/pages/users/userPage/${user.email}`} passHref >
                    <p className='text-2xl mb-2'>{user.name}</p>                    
                    <p>{user.city} </p>
                    <p>{user.address} </p>
                    <p>{user.email} </p>
                    <p>{user.phoneNumber} </p>
                    </Link>
                </div>                
                ))}
        </div>
    </div>
  );
}
