// pages/requests.js
'use client'

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Request() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (session) {
        try {
          const response = await fetch(`/api/pets/requests`);
          const data = await response.json();
          setRequests(data);
        } catch (error) {
          console.error('Failed to load requests:', error);
        }
      }
    };

    fetchRequests();
  }, [session]);

  return (
    <div>
      <h1 className="text-4xl font-semibold text-white mt-10 mb-10">Pedidos de Adoção</h1>
      {session ? (
        <div>
          {requests.length === 0 ? (
            <p className="text-white">Nenhum pedido de adoção encontrado.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {requests.map(request => (
                <div key={request._id} className="p-4 m-4 border border-white rounded-lg bg-white bg-opacity-80 backdrop-blur-lg shadow-lg">
                  <h2 className="text-gray-800 text-2xl">{request.petName}</h2>
                  <p className="text-gray-800">Adotante: {request.adopterEmail}</p>
                  <p className="text-gray-800">Status: {request.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>Você precisa estar logado para ver os pedidos de adoção.</p>
          <button onClick={() => signIn("google")}>Entrar com Google</button>
        </div>
      )}
    </div>
  );
}
