'use client'
import { useState, useEffect } from "react";
import cities from "@/app/data/cities";
import categories from "@/app/data/categories";
import sizes from "@/app/data/sizes";

export default function PetForm({ petData, onSubmit }) {
  const [pet, setPet] = useState(petData || {
    name: '',
    age: '',
    description: '',
    category: '',
    size: '',
    city: '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPet({ ...pet, [name]: value });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(pet); }} className="space-y-4">
      <div>
        <label className="block">Nome</label>
        <input
          type="text"
          name="name"
          value={pet.name}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
      </div>
      <div>
        <label className="block">Idade</label>
        <input
          type="number"
          name="age"
          value={pet.age}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
      </div>
      <div>
        <label className="block">Descrição</label>
        <textarea
          name="description"
          value={pet.description}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
      </div>
      <div>
        <label className="block">Tamanho</label>
        <select name="size" value={pet.size} onChange={handleChange}>
          <option value="">Selecione o Tamanho</option>
          {sizes.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block">Categoria</label>
        <select name="category" value={pet.category} onChange={handleChange}>
          <option value="">Selecione a Categoria</option>
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block">Cidade</label>
        <select name="city" value={pet.city} onChange={handleChange}>
          <option value="">Selecione a Cidade</option>
          {cities.map(city => (
            <option key={city.value} value={city.value}>{city.label}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
      >
        {petData ? 'Atualizar Pet' : 'Criar Pet'}
      </button>
    </form>
  );
}
