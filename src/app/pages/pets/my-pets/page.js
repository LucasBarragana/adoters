'use client'
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import FavoriteButton from "@/app/components/layout/Pets/FavoriteButton";
import Image from "next/image";

export default function MyPets() {
  const { data: session } = useSession();
  const [pets, setPets] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState({});

  const toggleDescription = (id) => {
    setShowFullDescription(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const formatDescription = (description, maxLength = 40) => {
    if (description.length <= maxLength) {
      return description;
    }
    return `${description.slice(0, maxLength)}...`;
  };

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
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-4 text-white mt-10">Meus Pets</h1>      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {pets.map(pet => (
            <div className='p-4 border border-white rounded-lg bg-white bg-opacity-80 backdrop-blur-lg shadow-lg relative' key={pet._id}>
              <div className="w-full h-40 overflow-hidden rounded-md flex justify-center items-center">
                <Image className="object-cover w-full h-full" src={pet.image} alt="petImage" width={160} height={160} />
              </div>
              <h2 className="text-gray-800 text-2xl mt-2">{pet.name}</h2>
              <div className="mt-2">
                <div>
                  <p className="text-gray-800">
                    <span className='font-semibold text-gray-800'>Sobre o pet:</span> <br />
                    {showFullDescription[pet._id] ? pet.description : formatDescription(pet.description)}
                    {pet.description.length > 40 && (
                      <span className="text-blue-500 cursor-pointer" onClick={() => toggleDescription(pet._id)}>
                        {showFullDescription[pet._id] ? ' [ver menos]' : ' [ver mais]'}
                      </span>
                    )}
                  </p>
                </div>
                <div className='flex justify-between gap-4 mt-2 text-sm'>
                  <p className="text-gray-800"><span className='font-semibold text-gray-800'>Cidade:</span> <br></br>{pet.city}</p>
                  <p className="text-gray-800"><span className='font-semibold text-gray-800'>Categoria:</span><br></br> {pet.category}</p>
                  <p className="text-gray-800"><span className='font-semibold text-gray-800'>Porte:</span><br></br> {pet.size}</p>
                </div>
              </div>
              <p className="text-gray-800 mt-5  bottom-0 left-0">
                Abrigo: <Link href={`/pages/users/user/${pet.creatorEmail}`} className="text-black font-semibold underline">{pet.creator}</Link>
              </p>
              <div className="absolute top-2 right-2">
                <FavoriteButton userId={session?.user?.email} petId={pet._id} isFavorite={pet.isFavorite} />
              </div>
              <button
                onClick={() => window.location.href = `/pages/pets/edit-pet/${pet._id}`}
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

