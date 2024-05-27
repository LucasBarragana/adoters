'use client'

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-white text-lg font-bold">Home</Link>
          <Link href="/create-pet" className="text-white">Criar Pet</Link>
          <Link href="/adoption" className="text-white">Adoção</Link>
        </div>
        <div>
          {session ? (
            <div className="flex items-center space-x-4">
              <span className="text-white">{session.user.name}</span>
              <button
                onClick={() => signOut()}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Entrar com Google
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
