'use client'

import useSWR from "swr";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Adoption() {
  const { data: pets, error } = useSWR("/api/pets", fetcher);

  if (error) return <div>Falha ao carregar os pets</div>;
  if (!pets) return <div>Carregando...</div>;

  return (
    <div className="max-w-5xl mx-auto my-10">
      <h1 className="text-2xl font-bold mb-4">Pets para Adoção</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.map((pet) => (
          <div key={pet._id} className="border border-gray-300 p-4 rounded">
            <h2 className="text-xl font-bold">{pet.name}</h2>
            <p>Idade: {pet.age}</p>
            <p>{pet.description}</p>
            <p>
              Criado por: <Link href={`/user/${pet.creatorEmail}`} className="text-blue-500">{pet.creator}</Link>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
