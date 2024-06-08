'use client'

import AuthLinks from "./AuthLinks";
import Header from "./Header";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Navbar () {
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
    return(
        <div className="flex justify-between align-center">
            <div>
                <nav className="flex items-center gap-8 text-white-500 font-semibold">
                    <Link className="flex text-primary font-semibold text-2xl" href={"/"}>
                        <Image src={'/logo-sf1.png'} width={80} height={80} alt={'logo'} /> 
                        <span className="flex items-center text-red-500 ml-4">AMOR</span><span className="text-white flex items-center">PET</span>
                    </Link>                  
                </nav>
            </div>
            <div className="flex mt-3">
                <Header />
                <AuthLinks status={status} userName={userName} />
            </div>
        </div>
    )
}