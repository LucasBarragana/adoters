'use client';
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
  if (userName && userName.includes(" ")) {
    userName = userName.split(" ")[0];
  }

  return (
    <header>
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-8 text-white-500 font-semibold">
          <Link className="flex text-primary font-semibold text-2xl" href={"/"}>
          <Image src={'/logo-sf1.png'} width={80} height={80} alt={'logo'} /> 
            <span className="flex items-center text-red-500 ml-4">AMOR</span><span className="text-white flex items-center">PET</span>
          </Link>                  
        </nav>
        <nav className="flex items-center gap-4 text-blue-900 font-semibold">  
          <div className="hidden md:flex mr-10 ">
            <Link href={"/"} className="mr-8 hover:text-blue-800 ">Home</Link>
            <Link href={"/pages/adoption"} className="mr-8 hover:text-blue-800 ">Adoção</Link>
            <Link href={"/#about"} className="mr-8 hover:text-blue-800 ">Sobre</Link>  
          </div>        
          <AuthLinks status={status} userName={userName} />  
        </nav>
      </div>
    </header>
  );
}