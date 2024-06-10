'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import FavoriteButton from '@/app/components/layout/Pets/FavoriteButton';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function UserPageId() {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [selectedPetName, setSelectedPetName] = useState('');
  const [selectedPetCreatorEmail, setSelectedPetCreatorEmail] = useState('');
  const [adoptionStatus, setAdoptionStatus] = useState({});
  const [showFullDescription, setShowFullDescription] = useState({});
  const [showAllDonations, setShowAllDonations] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef(null);
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`/api/users/${id}`);
          const data = await response.json();
          setUser(data);
        } catch (err) {
          setError('Falha ao carregar usuário');
        }
      };

      const fetchPets = async () => {
        try {
          const response = await fetch(`/api/users/${id}/pets`);
          const data = await response.json();
          setPets(data);
        } catch (err) {
          setError('Falha ao carregar pets');
        }
      };

      fetchUser();
      fetchPets();
      setLoading(false);
    }
  }, [id]);

  

  const formatDescription = (description, maxLength = 40) => {
    if (description.length <= maxLength) {
      return description;
    }
    return `${description.slice(0, maxLength)}...`;
  };

  const toggleDescription = (id) => {
    setShowFullDescription((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleAdoptButtonClick = (petId, petName, creatorEmail) => {
    if (!session) {
      alert('Você precisa estar logado para realizar esta ação.');
      return;
    }

    setSelectedPetId(petId);
    setSelectedPetName(petName);
    setSelectedPetCreatorEmail(creatorEmail);
    setShowConfirmationModal(true);
  };

  const handleConfirmAdoption = async () => {
    const newAdoptionStatus = { ...adoptionStatus, [selectedPetId]: { status: 'Em Analise' } };
    setAdoptionStatus(newAdoptionStatus);
    localStorage.setItem('adoptionStatus', JSON.stringify(newAdoptionStatus));
    setShowConfirmationModal(false);

    // Enviar o pedido de adoção para a API
    if (session) {
      try {
        await fetch('/api/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            petId: selectedPetId,
            petName: selectedPetName,
            adopterEmail: session.user.email,
            creatorEmail: selectedPetCreatorEmail,
          }),
        });
      } catch (error) {
        console.error('Failed to submit adoption request:', error);
      }
      await toast.promise(handleConfirmAdoption, {
        loading: 'Enviando...',
        success: 'Pedido Enviado com Sucesso',
        error: 'Ocorreu um problema',
      });
    }

    // Lógica para esperar 24 horas e atualizar o status do pet
    setTimeout(() => {
      const updatedAdoptionStatus = { ...adoptionStatus };
      delete updatedAdoptionStatus[selectedPetId];
      setAdoptionStatus(updatedAdoptionStatus);
      localStorage.setItem('adoptionStatus', JSON.stringify(updatedAdoptionStatus));
    }, 24 * 60 * 60 * 1000); // 24 horas
  };

  const handleCancelAdoption = () => {
    setShowConfirmationModal(false);
  };

  const countPetsForAdoption = () => {
    let count = 0;
    for (const petId in adoptionStatus) {
      if (adoptionStatus[petId].status === 'Visite/Adote') {
        count++;
      }
    }
    return count;
  };

  // Obtém o número de pets disponíveis para adoção
  const petsForAdoptionCount = countPetsForAdoption();

  // Função para abrir e fechar o popover
  const togglePopover = () => {
    setPopoverOpen(!popoverOpen);
  };

  // Função para fechar o popover quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverOpen && popoverRef.current && !popoverRef.current.contains(event.target)) {
        setPopoverOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popoverOpen]);

  
  useEffect(() => {
    const storedAdoptionStatus = localStorage.getItem('adoptionStatus');
    if (storedAdoptionStatus) {
      setAdoptionStatus(JSON.parse(storedAdoptionStatus));
    }
  }, []);

  if (error) {toast.error('Ocorreu um problema');}

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="mt-10 px-2">
      <div className="flex flex-col text-white mb-5 mt-10">
        <h1 className="text-4xl font-bold mb-4">Abrigo {user?.name}</h1>
        <div className="hidden flex justify-center items-center text-sm text-gray-750 bg-white bg-opacity-80 backdrop-blur-lg shadow-lg w-full p-4 rounded-lg mt-2">
          <p className="mr-4">ADOTADOS: 0</p>
          <div className="h-6 w-px bg-gray-400"></div>
          <p className="ml-4">Para adoção: {petsForAdoptionCount}</p>
        </div>
      </div>
      <div className="flex justify-between md:flex-row gap-4 p-4 border border-white rounded-lg bg-white bg-opacity-80 backdrop-blur-lg shadow-lg">
        <div className="text-gray-750 flex flex-col">
          <p className="text-xl mb-4 sm:text-2xl">Informações:</p>
          <p className="mb-2 text-xs sm:text-base">Responsável:<br></br> {user?.responsable}</p>
          <p className="mb-2 text-xs sm:text-base">Email:<br></br> {user?.email}</p>
          <p className="mb-2 text-xs sm:text-base">Endereço:<br></br> {user?.address}</p>
          <p className="mb-2 text-xs sm:text-base">Telefone:<br></br> {user?.phoneNumber}</p>
          <p className="mb-2 text-xs sm:text-base">Cidade:<br></br> {user?.city}</p>
        </div>
        <div className="text-gray-750 flex flex-col">
          <p className="text-xl mb-4 sm:text-2xl">Doações que precisamos:</p>
          <p className="mb-2 text-xs sm:text-base">Em dinheiro via pix:</p>
          <p className="mb-2 text-xs sm:text-base">{user?.document}</p>
          {user?.donations && user.donations.length > 0 ? (
            <div>
              <ul className="mb-2 text-xs sm:text-base">
                {user.donations.slice(0, showAllDonations ? user.donations.length : 5).map((item, index) => (
                  <li className='text-xs mb-2 sm:text-base' key={index}>{item}</li>
                ))}
              </ul>
              {user.donations.length > 5 && (
                <button onClick={togglePopover} className="bg-secundary text-white rounded-lg font-bold p-2 cursor-pointer mt-1 text-xs sm:text-base">
                  Ver mais
                </button>
              )}
            </div>
          ) : (
            <p>Nenhum item de doação necessário no momento.</p>
          )}
        </div>
        <div className="hidden sm:block text-gray-750 flex flex-col">
          <p className="text-xl mb-4 sm:text-2xl">Horários</p>
          {user?.openingHours && user.openingHours.length > 0 ? (
            <ul className="mb-2 text-xs sm:text-base">
              {user.openingHours.map((item, index) => (
                <li key={index} className="mb-2 text-xs sm:text-base">
                  {`${item.day}: ${item.openingTime} - ${item.closingTime}`}
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum horário de funcionamento definido no momento.</p>
          )}
        </div>
      </div>
      <div className='block sm:hidden'>
        <div className="block justify-center items-center text-sm text-gray-750 bg-white bg-opacity-80 backdrop-blur-lg shadow-lg w-full p-4 rounded-lg mt-2">
          <p className="text-xl mb-4 sm:text-2xl">Horários</p>
          <div className=''>          
              {user?.openingHours && user.openingHours.length > 0 ? (
                  <ul className="grid grid-cols-2 gap-2 mb-2 text-xs sm:text-base">
                  {user.openingHours.map((item, index) => (
                    <li key={index} className="mb-2 text-xs sm:text-base">
                      {`${item.day}: ${item.openingTime} - ${item.closingTime}`}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum horário de funcionamento definido no momento.</p>
              )}
          </div>
        </div>
      </div>   
      <div className="-mt-20 sm:mt-8">
        <h2 className="text-2xl font-bold mb-4 mt-32 text-gray-750">Pets para adoção neste abrigo:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {pets.length > 0 ? (
            pets.map((pet) => (
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
                <p className="text-gray-800 mt-5 bottom-0 left-0">
                  Abrigo: <Link href={`/pages/users/user/${pet.creatorEmail}`} className="text-black font-semibold underline">{pet.creator}</Link>
                </p>
                <div className="w-full bg-secundary text-white cursor-pointer flex justify-center align-center rounded-lg mt-4">
                  <button
                    onClick={() => handleAdoptButtonClick(pet._id, pet.name, pet.creatorEmail)}
                    className={`${
                      adoptionStatus[pet._id] && adoptionStatus[pet._id].status === 'Em Analise'
                        ? 'disabled'
                        : ''
                    } ${
                      adoptionStatus[pet._id] && adoptionStatus[pet._id].status === 'Em Analise' ? 'text-gray-750' : 'text-white'
                    }`} 
                    disabled={
                      adoptionStatus[pet._id] && adoptionStatus[pet._id].status === 'Em Analise'
                    }
                  >
                    {adoptionStatus[pet._id] && adoptionStatus[pet._id].status === 'Em Analise'
                      ? 'Em Análise'
                      : 'Visite/Adote'}
                  </button>
                </div>
                <div className="absolute top-2 right-2">
                  <FavoriteButton userId={session?.user?.email} petId={pet._id} isFavorite={pet.isFavorite} />
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum pet criado por este usuário.</p>
          )}
        </div>
      </div>

      {/* Modal de confirmação */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <div className='flex justify-center align-center gap-2'>
              <h1 className='font-semibold text-secundary'>UHULL, QUE FELICIDADE!</h1>
              <Image className="" src="/festa.png" alt="petImage" width={36} height={26} />
            </div>   
            <p className="text-gray-800 mb-4">
              Oi, me chamo {selectedPetName}, estou ansioso(a) para te conhecer e te encher de amor. Caso tenha certeza que me quer, clique em{' '}
              <span className="font-semibold text-secondary">Sim</span> e vou te esperar por <span className="font-semibold text-secondary">24h</span>.
            </p>
            <div className="flex justify-end">
              <button onClick={handleConfirmAdoption} className="bg-green-500 text-white p-2 rounded mr-2">
                Sim
              </button>
              <button onClick={handleCancelAdoption} className="bg-gray-500 text-white p-2 rounded">
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de doações */}
      {popoverOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 mt-100">
          <div ref={popoverRef} className="bg-white p-6 rounded-lg shadow-lg w-80 h-auto  sm:bg-white p-6 rounded-lg shadow-lg">
            <ul className="space-y-2">
              <p className="text-2xl font-semibold">Doações que precisamos:</p>
              {user.donations.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}