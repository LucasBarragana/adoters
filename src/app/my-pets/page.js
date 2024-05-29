'use client'
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";

export default function MyPets() {
  const { data: session } = useSession();
  const [pets, setPets] = useState([]);

  useEffect(() => {
    if (session) {
      fetch('/api/pets/my-pets')
        .then(res => res.json())
        .then(data => setPets(data))
        .catch(error => console.error('Erro ao buscar pets:', error));
    }
  }, [session]);

  if (!session) {
    return (
      <div>
        <p>Você precisa estar logado para ver seus pets.</p>
        <button onClick={() => signIn("google")}>Entrar com Google</button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto my-10">
      <h1 className="text-2xl font-bold mb-4">Meus Pets</h1>
      <ul className="space-y-4">
        {pets.map(pet => (
          <li key={pet._id} className="border p-4 rounded">
            <h2 className="text-xl font-bold">{pet.name}</h2>
            <p>Idade: {pet.age}</p>
            <p>Descrição: {pet.description}</p>
            <p>Tamanho: {pet.size}</p>
            <p>Categoria: {pet.category}</p>
            <p>Cidade: {pet.city}</p>
            <button
              onClick={() => window.location.href = `/edit-pet/${pet._id}`}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
            >
              Editar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
