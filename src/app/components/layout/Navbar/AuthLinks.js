'use client'

import { useState, useEffect, useRef } from "react";
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
import Star from "../../icons/star";
import Home from "../../icons/Home";
import Adoptionpets from "../../icons/Adoption";
import Shelters from "../../icons/Shelters";
import More from "../../icons/More";
import Menu from "../../icons/Menu";

const AuthLinks = ({ status, userName }) => {
  const [admin, setAdmin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session } = useSession();
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function checkAdmin() {
      const isAdminUser = await isAdmin();
      setAdmin(isAdminUser);
    }
    checkAdmin();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    const handleScroll = () => {
      setDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  if (status === 'authenticated') {
    return (
      <div className='dropdown' ref={dropdownRef}>
        <div className="flex justify-center align-center items-center gap-2">
          <p className="hidden sm:hidden md:hidden lg:block items-center pl-4 text-xl ml-4">Olá, 
            <span className="ml-1 text-secundary  font-semibold">{userName}</span> 
          </p>
          <button onClick={toggleDropdown} className="bg-secundary"><Menu /></button>
        </div>           
          {dropdownOpen && (
            <div className="dropdown-content">
              <div className="flex justify-center align-center mt-2 mb-2">
                <p className="font-semibold text-xl text-secundary">Minha Conta</p>
              </div>
              <div className="bg-gray-300 w-full py-[1px] "></div>
              <div className="sm:hidden flex items-center pl-4 hover:bg-gray-300">
                <Home className="mr-2" />
                <Link href="/" className="flex items-center"> Home</Link>
              </div>
              <div className="sm:hidden flex items-center pl-4 hover:bg-gray-300">
                <Shelters className="mr-2" />
                <Link href="/pages/shelters" className="flex items-center">Abrigos</Link>
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
                <div className="bg-gray-300 w-full py-[1px] "></div>  
              <div>
                <button className="border-none text-red-500 flex items-center hover:bg-gray-300" onClick={() => signOut({ callbackUrl: '/' })}><Logout className="mr-2" /> Sair</button>
              </div>
            </div>
            )  
          }
        </div>
      )
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
  

export default AuthLinks
