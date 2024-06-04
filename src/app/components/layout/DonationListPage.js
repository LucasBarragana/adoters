'use client';

import React, { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Delete from '../icons/Delete';

const DonationListPage = ({ donations, onDonationsChange }) => {
  const { data: session } = useSession();
  const [item, setItem] = useState('');

  const handleAddItem = (e) => {
    e.preventDefault();
    if (item.trim()) {
      const newDonations = [...donations, item];
      onDonationsChange(newDonations);
      setItem('');
    }
  };

  const handleDeleteItem = (index) => {
    const newDonations = donations.filter((_, i) => i !== index);
    onDonationsChange(newDonations);
  };

  if (!session) {
    return (
      <div>
        <p>Você precisa estar logado para gerenciar a lista de doações.</p>
        <button onClick={() => signIn("google")}>Entrar com Google</button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto my-10">
      <h1 className="text-4xl font-bold mb-4 text-gray-700">Lista de Itens de Doação Necessários</h1>
      <form onSubmit={handleAddItem} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Novo Item</label>
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="Adicione um novo item"
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          Adicionar Item
        </button>
      </form>
      <ul className="mt-4 space-y-2">
        {donations && donations.map((item, index) => (
          <li key={index} className="flex justify-between items-center p-2 bg-white rounded shadow">
            <span className='font-semibold'>{item}</span>
            <button
              onClick={() => handleDeleteItem(index)}
              className="bg-red-400 text-white p-1 rounded hover:bg-red-700 w-20"
            >
              <Delete />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonationListPage;
