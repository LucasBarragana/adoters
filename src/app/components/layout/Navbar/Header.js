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
            <Link href={"/"} className="mr-8 md:text-white lg:text-blue-800 hover:text-blue-800">Home</Link>
            <Link href={"/pages/shelters"} className="mr-8 md:text-white lg:text-blue-800 hover:text-blue-800">Abrigos</Link>
            <Link href={"/pages/adoption"} className="mr-8 md:text-white lg:text-blue-800 hover:text-blue-800">Adoção</Link>
            <Link href={"/#about"} className="mr-8 md:text-white lg:text-blue-800 hover:text-blue-800">Sobre</Link>  
          </div>         
        </nav>
      </div>
    </header>
  );
}
