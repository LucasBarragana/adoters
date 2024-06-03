'use client'
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import FavoriteButton from "../components/FavoriteButton";

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
      <div className="text-center p-10">
        <p className="text-2xl">Você precisa estar logado para ver seus pets.</p>
        <button onClick={() => signIn("google")} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 mt-4">
          Entrar com Google
        </button>
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="text-4xl font-bold mb-4 text-white mt-10">Meus Pets</h1>      
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {pets.map(pet => (
            <div className='p-4 m-4 border border-white rounded-lg bg-white bg-opacity-80 backdrop-blur-lg shadow-lg relative' key={pet._id}>
              <h2 className="text-gray-800 text-2xl">{pet.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">              
                <div>                
                  <p className="text-gray-800"><span className='font-semibold text-gray-800'>Sobre o pet:</span> {pet.description}</p>
                </div>
                <div>
                  <p className="text-gray-800 "><span className='font-semibold text-gray-800'>Cidade:</span> {pet.city}</p>
                  <p className="text-gray-800"><span className='font-semibold text-gray-800'>Categoria:</span> {pet.category}</p>
                  <p className="text-gray-800"><span className='font-semibold text-gray-800'>Porte:</span> {pet.size}</p>
                </div>
              </div>
              <p className="text-gray-800 mt-5  bottom-0 left-0">
                Abrigo: <Link href={`/user/${pet.creatorEmail}`} className="text-black font-semibold underline">{pet.creator}</Link>
              </p>
              <div className="absolute top-2 right-2">
                <FavoriteButton userId={session?.user?.email} petId={pet._id} isFavorite={pet.isFavorite} />
              </div>
              <button
                onClick={() => window.location.href = `/edit-pet/${pet._id}`}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 mt-2"
              >
                Editar
              </button>
            </div>
          ))}
        </div>
    </div>
  );
}
