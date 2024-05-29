// components/AddressInputs.js
'use client';
import { useState } from 'react';
import cities from '@/data/cities';

export default function AddressInputs({ addressProps, setAddressProp, disabled = false }) {
  const [selectedCity, setSelectedCity] = useState('');

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const { phone, streetAddress, postalCode, city } = addressProps;
  return (
    <>
      <label>Telefone</label>
      <input
        disabled={disabled}
        type="tel"
        placeholder="Número do telefone"
        value={phone || ''}
        onChange={(ev) => setAddressProp('phone', ev.target.value)}
      />
      <label>Endereço</label>
      <input
        disabled={disabled}
        type="text"
        placeholder="Endereço"
        value={streetAddress || ''}
        onChange={(ev) => setAddressProp('streetAddress', ev.target.value)}
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label>Código postal</label>
          <input
            disabled={disabled}
            type="text"
            placeholder="Código Postal"
            value={postalCode || ''}
            onChange={(ev) => setAddressProp('postalCode', ev.target.value)}
          />
        </div>
        <div>
          <label>Cidade</label>
          <select
            disabled={disabled}
            value={selectedCity}
            onChange={(ev) => {
              setAddressProp('city', ev.target.value);
              handleCityChange(ev);
            }}
            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Selecione uma cidade</option>
            {cities.map((city) => (
              <option key={city.value} value={city.value}>
                {city.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
