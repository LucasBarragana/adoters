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
    <div className="">
      <h1 className="text-4xl font-bold mb-4 text-white mt-10">Meus Pets</h1>      
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
          {pets.map(pet => (
            <div className='p-4 m-2 border border-white rounded-lg bg-white bg-opacity-80 backdrop-blur-lg shadow-lg relative' key={pet._id}>
              <div>
                <Image className="rounded-md" src={pet.image} alt={"petImage"} width={200} height={200} />
              </div>
              <h2 className="text-gray-800 text-2xl">{pet.name}</h2>
              <div className="mt-2">              
                <div>
                  <p className="text-gray-800">
                    <span className='font-semibold text-gray-800'>Sobre o pet:</span> <br/>
                    {showFullDescription[pet._id] ? pet.description : formatDescription(pet.description)}
                    {pet.description.length > 40 && (
                      <span className="text-blue-500 cursor-pointer" onClick={() => toggleDescription(pet._id)}>
                        {showFullDescription[pet._id] ? ' [ver menos]' : ' [ver mais]'}
                      </span>
                    )}
                  </p>
                </div>
                <div className='flex mt-2 text-sm gap-4'>
                  <p className="text-gray-800"><span className='font-semibold text-gray-800'>Cidade:</span> {pet.city}</p>
                  <p className="text-gray-800"><span className='font-semibold text-gray-800'>Categoria:</span> {pet.category}</p>
                  <p className="text-gray-800"><span className='font-semibold text-gray-800'>Porte:</span> {pet.size}</p>
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

