import React, { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import days from '@/app/data/days';
import Delete from '../../icons/Delete';

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="">Selecione o Dia</option>
              {days.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
          <br></br>
          <div className='flex gap-4'>
            <input
              type="time"
              value={openingTime}
              onChange={(e) => setOpeningTime(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
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
            className="col-span-2 bg-blue-500 text-gray-700 p-2 rounded hover:bg-blue-700"
          >
            Adicionar Horário
          </button>
        </div>
      </form>
      <ul className="mt-4 space-y-2">
        {openingHours && openingHours.map((item, index) => (
          <li key={index} className="flex justify-between items-center p-2 bg-white rounded shadow">
            <span>{`${item.day}: ${item.openingTime} - ${item.closingTime}`}</span>
            <button
              onClick={() => handleDeleteOpeningHour(index)}
              className="bg-red-400 text-white p-1 w-16 h-8 rounded hover:bg-red-700"
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
