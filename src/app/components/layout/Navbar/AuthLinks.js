import { useState, useEffect } from "react";
import { signIn, signOut } from "next-auth/react";
import { isAdmin } from "@/app/utils/isAdmin";
import Link from "next/link";
import Image from "next/image";
import { useSession } from 'next-auth/react';

import Person from "../../icons/Person";
import Pets from "../../icons/Pets";
import Money from "../../icons/Money";
import AddPet from "../../icons/AddPet";
import Logout from "../../icons/Logout";
import More from "../../icons/More";
import Star from "../../icons/star";
import Home from "../../icons/Home";
import Adoptionpets from "../../icons/Adoption";
import Menu from "../../icons/Menu";

export default function AuthLinks({ status, userName }) {
  const [admin, setAdmin] = useState(false);
  const { data: session } = useSession();
  useEffect(() => {
    async function checkAdmin() {
      const isAdminUser = await isAdmin();
      setAdmin(isAdminUser);
    }
    checkAdmin();
  }, []);

  useEffect(() => {
    function handleWindowClick(event) {
      if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    }

    window.addEventListener('click', handleWindowClick);

    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, []);

  function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  if (status === 'authenticated') {
    return (
      <div className="dropdown">
        <div className="hidden sm:block">
          <button onClick={myFunction} className="dropbtn">Olá, {userName} <More className="ml-2" /></button>
        </div>
        <div className="block sm:hidden">
          <button onClick={myFunction} className="dropbtn"><Menu /></button>
        </div>        
        <div id="myDropdown" className="dropdown-content">
          <div className="sm:hidden flex items-center pl-4 hover:bg-gray-300">
            <Home className="mr-2" />
            <Link href="/" className="flex items-center"> Home</Link>
          </div>
          <div className="sm:hidden flex items-center pl-4 hover:bg-gray-300">
            <Adoptionpets className="mr-2" />
            <Link href="/pages/adoption" className="flex items-center">Adotar</Link>
          </div>
          {admin && (
            <div className="flex items-center pl-4 hover:bg-gray-300">     
              <AddPet className="mr-2" />         
              <Link href="/pages/users/request" className="flex items-center"> Adoções</Link>
            </div>
          )}
          <div className="flex items-center pl-4 hover:bg-gray-300">
            <Person className="mr-2" />
            <Link href="/pages/users/profile" className="flex items-center"> Meu Perfil</Link>
          </div>
          {admin && (
            <div className="flex items-center pl-4 hover:bg-gray-300">     
              <AddPet className="mr-2" />         
              <Link href="/pages/pets/create-pet" className="flex items-center"> Add um Pet</Link>
            </div>
          )}
          {admin && (
          <div className="flex items-center pl-4 hover:bg-gray-300">
            <Pets className="mr-2" />
            <Link href="/pages/pets/my-pets" className="flex items-center"> Meus Pets</Link>
          </div>
          )}
          {admin && (
          <div className="flex items-center pl-4 hover:bg-gray-300">
            <Money className="mr-2" />
            <Link href={`/pages/users/user/${session.user.email}`} className="text-blue-500">
              Ver Página
            </Link>
          </div>
          )}
          <div className="flex items-center pl-4 hover:bg-gray-300">
            <Star className="mr-2" />
            <Link href="/pages/pets/favorites" className="flex items-center"> Favoritos</Link>
          </div>
          
          
          <div>
            <button className="border-none text-red-500 flex items-center hover:bg-gray-300" onClick={() => signOut({ callbackUrl: '/' })}><Logout className="mr-2" /> Sair</button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="relative inline-block text-left">
        <button className="border-none bg-white text-secundary sm:bg-secundary sm:text-white" type="button" onClick={() => signIn('google', { callbackUrl: '/pages/users/profile' })}>
              <Image src={'/google.png'} alt="Google Logo" width={24} height={24} />
              Entrar
            </button>
      </div>
    );
  }

  return null;
}
