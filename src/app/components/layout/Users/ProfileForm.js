'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import cities from '@/app/data/cities';

export default function ProfileForm({ userData, onSubmit }) {
  const [user, setUser] = useState(userData || {
    name: '',
    responsable: '',
    document:'',
    address: '',
    postalCode: '',
    phoneNumber: '',
    city: '',
    admin: false, 
  });

  const router = useRouter();

  useEffect(() => {
    setUser(userData);
  }, [userData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({ ...user, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(user);
    if (user.admin) {
        router.push('/pages/users/info-shelter', undefined, { shallow: true });
    } else {
        router.push('/pages/adoption', undefined, { shallow: true });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto my-10">
      <div>
        <label className="block text-gray-950 mb-2">Nome</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-gray-910 mb-2">Responsável - Caso de Abrigo</label>
        <input
          type="text"
          name="responsable"
          value={user.responsable}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>
      <div>
        <label className="block text-gray-910 mb-2">CPF/CNPJ</label>
        <input
          type="text"
          name="document"
          value={user.document}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>
      <div>
        <label className="block text-gray-910 mb-2">Endereço Completo</label>
        <input
          type="text"
          name="address"
          value={user.address}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-gray-910 mb-2">CEP</label>
        <input
          type="text"
          name="postalCode"
          value={user.postalCode}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>
      <div>
        <label className="block text-gray-910 mb-2">Telefone Celular</label>
        <input
          type="text"
          name="phoneNumber"
          value={user.phoneNumber}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-gray-910 mb-2">Cidade</label>
        <select name="city" value={user.city} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" required>
          <option value="">Selecione uma Cidade</option>
          {cities.map(city => (
            <option key={city.value} value={city.value}>{city.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="flex text-gray-910 mb-2 text-sm gap-2 sm:flex text-gray-910 mb-2 text-base gap-2 md:flex text-gray-910 mb-2 text-xl gap-2 lg:flex text-gray-910 mb-2 text-xl gap-2">
          <input
            type="checkbox"
            name="admin"
            checked={user.admin}
            onChange={handleChange}
          />
          Caso esteja criando um abrigo, clique aqui!
        </label>
      </div>
      <button type="submit" className="bg-blue-500 text-gray-910 p-2 rounded hover:bg-blue-910 w-full">
        Atualizar Perfil
      </button>
    </form>
  );
}
