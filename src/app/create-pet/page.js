'use client'
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

import categories from "@/data/categories";
import sizes from "@/data/sizes";

export default function CreatePet() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (session) {
      fetch(`/api/users/${session.user.email}`)
        .then(res => res.json())
        .then(data => setCity(data.city))
        .catch(error => console.error('Erro ao buscar usuário:', error));
    }
  }, [session]);

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedName = capitalize(name);
    const formattedDescription = capitalize(description);
    const formattedCity = capitalize(city);
    const res = await fetch("/api/pets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formattedName,
        age,
        description: formattedDescription,
        city: formattedCity,
        category,
        size
      }),
    });

    if (res.ok) {
      alert("Pet criado com sucesso!");
      setName("");
      setAge("");
      setDescription("");
      setCategory("");
      setSize("");
      setImage(null);
      setImageUrl(null);
    } else {
      const errorData = await res.json();
      alert(`Erro: ${errorData.message}`);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
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
      <h1 className="text-4xl font-bold mb-4 text-white">Criar Novo Pet</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="bg-gray-300 text-white p-2 rounded hover:bg-gray-700"
            />
          </div>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              style={{ height: '38px', marginLeft: '10px', objectFit: 'contain' }}
            />
          )}
        </div>
        <div>
          <label className="block text-white mb-2">Nome</label>
          <input
            placeholder="Nome do pet"
            type="text"
            value={name}
            onChange={(e) => setName(capitalize(e.target.value))}
            required
          />
        </div>
        <div>
          <label className="block text-white mb-2">Idade</label>
          <input
            placeholder="Idade aproximada do pet, caso seja possível"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-white mb-2">Descrição</label>
          <textarea
            type="description"
            value={description}
            onChange={(e) => setDescription(capitalize(e.target.value))}
            placeholder="Adicione algumas caracteristicas do pet"
            required
          />
        </div>
        <div>
          <label className="block text-white mb-2">Tamanho</label>
          <select value={size} onChange={(e) => setSize(e.target.value)} required>
            <option value="">Selecione o Tamanho</option>
            {sizes.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-white mb-2">Tipo</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Selecione a Categoria</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
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
