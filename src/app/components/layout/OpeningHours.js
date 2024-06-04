'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import days from '@/data/days';
import Delete from '../icons/Delete';

const OpeningHours = ({ openingHours, onOpeningHoursChange }) => {
  const { data: session } = useSession();
  const [day, setDay] = useState('');
  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');

  const handleAddOpeningHour = (e) => {
    e.preventDefault();
    if (day && openingTime && closingTime) {
      const newOpeningHours = [...openingHours, { day, openingTime, closingTime }];
      onOpeningHoursChange(newOpeningHours);
      setDay('');
      setOpeningTime('');
      setClosingTime('');
    }
  };

  const handleDeleteOpeningHour = (index) => {
    const newOpeningHours = openingHours.filter((_, i) => i !== index);
    onOpeningHoursChange(newOpeningHours);
  };

  if (!session) {
    return (
      <div>
        <p>Você precisa estar logado para gerenciar os horários de funcionamento.</p>
        <button onClick={() => signIn("google")}>Entrar com Google</button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto my-10">
      <h1 className="text-4xl font-bold mb-4 text-gray-700">Horários de Funcionamento</h1>
      <form onSubmit={handleAddOpeningHour} className="space-y-4">
        <div>
          <select type="text" value={day} onChange={(e) => setDay(e.target.value)} required>
            <option value={setDay}>Selecione o Dia</option>
            {days.map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Hora de Abertura</label>
          <input
            type="time"
            value={openingTime}
            onChange={(e) => setOpeningTime(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Hora de Fechamento</label>
          <input
            type="time"
            value={closingTime}
            onChange={(e) => setClosingTime(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-gray-700 p-2 rounded hover:bg-blue-700"
        >
          Adicionar Horário
        </button>
      </form>
      <ul className="mt-4 space-y-2">
        {openingHours && openingHours.map((item, index) => (
          <li key={index} className="flex justify-between items-center p-2 bg-white rounded shadow">
            <span>{`${item.day}: ${item.openingTime} - ${item.closingTime}`}</span>
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

export default OpeningHours;
