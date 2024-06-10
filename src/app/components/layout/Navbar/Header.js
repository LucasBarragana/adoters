'use client';
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import AuthLinks from "./AuthLinks";

export default function Header() {
  const session = useSession();
  const status = session?.status;
  const userData = session.data?.user;
  let userName = userData?.name || userData?.email;
  if (userName && userName.includes(" ")) {
    userName = userName.split(" ")[0];
  }

  return (
    <header id="header">
      <div className="flex items-center justify-between mt-2">        
        <nav className="md:flex items-center gap-4 font-semibold">  
          <div className="hidden md:flex mr-10">
            <Link href={"/"} id="inicio" className="mr-8 ">Home</Link>
            <Link href={"/pages/shelters"} id="abrigo" className="mr-8 ">Abrigos</Link>
            <Link href={"/pages/adoption"} id="adocao" className="mr-8 ">Adoção</Link>
            <Link href={"/#about"} id="sobre" className="mr-8 ">Sobre</Link>  
          </div>         
        </nav>
      </div>
    </header>
  );
}
