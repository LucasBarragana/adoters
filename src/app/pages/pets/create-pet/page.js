'use client'
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import categories from "@/app/data/categories";
import sizes from "@/app/data/sizes";
import EditableImage from "@/app/components/layout/Pets/EditableImage";
import toast from "react-hot-toast";

export default function CreatePet() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (session) {
      fetch(`/api/users/${session.user.email}`)
        .then((res) => res.json())
        .then((data) => setCity(data.city))
        .catch((error) => console.error("Erro ao buscar usuário:", error));
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
        size,
        image,
      }),      
    });

    if (res.ok) {
      toast.promise("Pet criado com sucesso!");
      setName("");
      setAge("");
      setDescription("");
      setCategory("");
      setSize("");
      setImage(null);
    } else {
      const errorData = await res.json();
      toast.promise(`Erro: ${errorData.message}`);
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
    <div className="p-4 m-4 border border-white rounded-lg bg-white bg-opacity-80 backdrop-blur-lg shadow-lg relative">
      <div className="max-w-lg mx-auto my-10">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Criar Novo Pet</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-gray-800">Imagem</label>
          <div className="flex items-center">
            <EditableImage link={image} setLink={setImage} />
          </div>
          <div>
            <label className="block text-gray-800 mb-2">Nome</label>
            <input
              placeholder="Nome do pet"
              type="text"
              value={name}
              onChange={(e) => setName(capitalize(e.target.value))}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-800 mb-2">Idade</label>
            <input
              placeholder="Idade aproximada do pet, caso seja possível"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-800 mb-2">Descrição</label>
            <textarea
              type="description"
              value={description}
              onChange={(e) => setDescription(capitalize(e.target.value))}
              placeholder="Adicione algumas características do pet (máx: 100 caracteres)"
              maxLength={100}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-800 mb-2">Tamanho</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="">Selecione o Tamanho</option>
              {sizes.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-800 mb-2">Tipo</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="">Selecione a Categoria</option>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-gray-800 p-2 rounded hover:bg-blue-700"
          >
            Criar Pet
          </button>
        </form>
      </div>
    </div>
    
  );
}
