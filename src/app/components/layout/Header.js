'use client';
import { useState, useContext } from "react";
import { CartContext } from "../AppContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import AuthLinks from "./AuthLinks";

export default function Header() {
  const session = useSession();
  const status = session?.status;
  console.log(session)
  console.log(status)
  const userData = session.data?.user;
  console.log(userData)
  let userName = userData?.name || userData?.email;
  const { cartProducts } = useContext(CartContext);
  if (userName && userName.includes(" ")) {
    userName = userName.split(" ")[0];
  }

  return (
    <header>
      <div className="hidden md:flex items-center justify-between">
        <nav className="flex items-center gap-8 text-gray-500 font-semibold">
          <Link className="flex text-primary font-semibold text-2xl" href={"/"}>
          <Image src={'/logo-sf1.png'} width={80} height={80} alt={'logo'} /> 
            <span className="flex items-center text-red-500">AMOR</span><span className="text-secundary flex items-center">PET</span>
          </Link>
          <Link href={"/"} className="hover:text-gray-800 ">Home</Link>
          <Link href={"/adoption"} className="hover:text-gray-800 ">Adoção</Link>
          <Link href={"/donetions"} className="hover:text-gray-800 ">Doações</Link>
          <Link href={"/#about"} className="hover:text-gray-800 ">Sobre</Link>          
        </nav>
        <nav className="flex items-center gap-4 text-gray-500 font-semibold">          
          <AuthLinks status={status} userName={userName} />          
        </nav>
      </div>
    </header>
  );
}
