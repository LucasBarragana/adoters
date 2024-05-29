'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import cities from "@/data/cities";
import categories from "@/data/categories";
import sizes from "@/data/sizes";

export default function EditPet() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [pet, setPet] = useState(null);

  useEffect(() => {
    if (id && session) {
      fetch(`/api/pets/${id}`)
        .then(res => res.json())
        .then(data => setPet(data))
        .catch(error => console.error('Erro ao buscar pet:', error));
    }
  }, [id, session]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/pets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pet),
    });

    if (res.ok) {
      alert("Pet atualizado com sucesso!");
      router.push("/my-pets");
    } else {
      const errorData = await res.json();
      alert(`Erro: ${errorData.message}`);
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

  if (!pet) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="max-w-lg mx-auto my-10">
      <h1 className="text-2xl font-bold mb-4">Editar Pet</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block">Nome</label>
          <input
            type="text"
            value={pet.name}
            onChange={(e) => setPet({ ...pet, name: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Idade</label>
          <input
            type="number"
            value={pet.age}
            onChange={(e) => setPet({ ...pet, age: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Descrição</label>
          <textarea
            value={pet.description}
            onChange={(e) => setPet({ ...pet, description: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Tamanho</label>
          <select value={pet.size} onChange={(e) => setPet({ ...pet, size: e.target.value })}>
            <option value="">Selecione o Tamanho</option>
            {sizes.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block">Categoria</label>
          <select value={pet.category} onChange={(e) => setPet({ ...pet, category: e.target.value })}>
            <option value="">Selecione a Categoria</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block">Cidade</label>
          <select value={pet.city} onChange={(e) => setPet({ ...pet, city: e.target.value })}>
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
          Atualizar Pet
        </button>
      </form>
    </div>
  );
}
