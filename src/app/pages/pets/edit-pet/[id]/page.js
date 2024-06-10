'use client'

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import categories from "@/app/data/categories";
import sizes from "@/app/data/sizes";
import EditableImage from "@/app/components/layout/Pets/EditableImage";
import toast from "react-hot-toast";

export default function EditPet() {
  const router = useRouter();
  const { id } = useParams();
  const { data: session } = useSession();
  const [pet, setPet] = useState({
    name: "",
    age: "",
    description: "",
    city: "",
    size: "",
    category: "",
    image: null,
  });

  useEffect(() => {
    if (id && session) {
      fetch(`/api/pets/${id}`)
        .then((res) => res.json())
        .then((data) => setPet(data))
        .catch((error) => console.error("Erro ao buscar pet:", error));
    }
  }, [id, session]);

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formattedName = capitalize(pet.name);
    const formattedDescription = capitalize(pet.description);
    const formattedCity = capitalize(pet.city);
    const res = await fetch(`/api/pets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...pet,
        name: formattedName,
        description: formattedDescription,
        city: formattedCity,
      }),
    });

    if (res.ok) {
      toast.success("Pet atualizado com sucesso!");
      router.push("/pages/pets/my-pets");
    } else {
      const errorData = await res.json();
      toast.error(`Erro: ${errorData.message}`);
    }
  };

  if (!session) {
    return (
      <div>
        <p>Você precisa estar logado para editar um pet.</p>
        <button onClick={() => signIn("google")}>Entrar com Google</button>
      </div>
    );
  }

  if (!pet.name) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="p-4 m-4 border border-white rounded-lg bg-white bg-opacity-80 backdrop-blur-lg shadow-lg relative">
      <div className="max-w-lg mx-auto my-10">
        <h1 className="text-4xl font-bold mb-4 text-gray-750">Editar Pet</h1>
        <form onSubmit={handleUpdate} className="space-y-4">
          <label className="block text-gray-750">Imagem</label>
          <div className="flex items-center">
            <EditableImage
              link={pet.image}
              setLink={(link) => setPet({ ...pet, image: link })}
            />
          </div>
          <div>
            <label className="block text-gray-750 mb-2">Nome</label>
            <input
              placeholder="Nome do pet"
              type="text"
              value={pet.name}
              onChange={(e) =>
                setPet({ ...pet, name: capitalize(e.target.value) })
              }
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-750 mb-2">Idade</label>
            <input
              placeholder="Idade aproximada do pet, caso seja possível"
              type="number"
              value={pet.age}
              onChange={(e) => setPet({ ...pet, age: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-750 mb-2">Descrição</label>
            <textarea
              type="description"
              value={pet.description}
              onChange={(e) =>
                setPet({
                  ...pet,
                  description: capitalize(e.target.value),
                })
              }
              placeholder="Adicione algumas características do pet (max: 100 caracteres)"
              maxLength={100}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-750 mb-2">Tamanho</label>
            <select
              value={pet.size}
              onChange={(e) => setPet({ ...pet, size: e.target.value })}
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
            <label className="block text-gray-750 mb-2">Categoria</label>
            <select
              value={pet.category}
              onChange={(e) => setPet({ ...pet, category: e.target.value })}
              required
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="">Selecione a Categoria</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-gray-750 p-2 rounded hover:bg-blue-750"
          >
            Atualizar Pet
          </button>
        </form>
      </div>
    </div>
  );
}
