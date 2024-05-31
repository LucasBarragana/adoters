'use client'
import { useState, useEffect } from 'react';
import cities from '@/data/cities';

export default function ProfileForm({ userData, onSubmit }) {
  const [user, setUser] = useState(userData || {
    name: '',
    lastName: '',
    address: '',
    postalCode: '',
    phoneNumber: '',
    city: '',
    admin: false, // Adiciona o campo admin no estado inicial
  });

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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-white mb-2">Nome</label>
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
        <label className="block text-white mb-2">Sobrenome</label>
        <input
          type="text"
          name="lastName"
          value={user.lastName}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>
      <div>
        <label className="block text-white mb-2">Endereço Completo</label>
        <input
          type="text"
          name="address"
          value={user.address}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>
      <div>
        <label className="block text-white mb-2">CEP</label>
        <input
          type="text"
          name="postalCode"
          value={user.postalCode}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>
      <div>
        <label className="block text-white mb-2">Telefone Celular</label>
        <input
          type="text"
          name="phoneNumber"
          value={user.phoneNumber}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>
      <div>
        <label className="block text-white mb-2">Cidade</label>
        <select name="city" value={user.city} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded">
          <option value="">Selecione a Cidade</option>
          {cities.map(city => (
            <option key={city.value} value={city.value}>{city.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="p-2 inline-flex items-center gap-2 mb-2" htmlFor="adminCb">
          <input
            id="adminCb"
            type="checkbox"
            name="admin"
            checked={user.admin}
            onChange={handleChange}
          />
          <span className='text-2xl'>Caso esteja criando um abrigo, clique aqui!</span>
        </label>
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
        Atualizar Perfil
      </button>
    </form>
  );
}
