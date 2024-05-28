'use client'
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

import cities from "@/data/cities";
import categories from "@/data/categories";
import sizes from "@/data/sizes";

export default function CreatePet() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/pets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, age, description, city, category, size }),
    });
  
    if (res.ok) {
      alert("Pet criado com sucesso!");
      setName("");
      setAge("");
      setDescription("");
      setCategory("");
      setSize("");
      setCity("");
    } else {
      const errorData = await res.json();
      alert(`Erro: ${errorData.message}`);
    }
  };
  

  if (!session) {
    return (
      <div>
        <p>Você precisa estar logado para criar um pet.</p>
        <button onClick={() => signIn("google")}>Entrar com Google</button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto my-10">
      <h1 className="text-2xl font-bold mb-4">Criar Novo Pet</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Idade</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Tamanho</label>
          <select value={size} onChange={(e) => setSize(e.target.value)} required>
            <option value="">Selecione o Tamanho</option>
            {sizes.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block">Tipo</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Selecione a Categoria</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block">Cidade</label>
          <select value={city} onChange={e => setCity(e.target.value)} required>
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
          Criar Pet
        </button>
      </form>
    </div>
  );
}
