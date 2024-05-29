'use client'

import Image from "next/image"
import Right from "../icons/Right"
import Link from "next/link"

export default function Footer() {
    return(
        <footer className="border-t p-8 text-center text-gray-500 mt-16">
            &copy; 2024 Todos direitos reservados - Dev. por Lucas Oliveira Barragana
            <div className="flex justify-between">
                <div className="mt-5">
                    <h1 className="text-4xl">Contato</h1>
                    <p className="text-2xl">Email:</p>
                    <p>adoteumpetrs@gmail.com</p>
                    <p>lucasobarragana@gmail.com</p>
                    <div className="flex mt-4">
                        <Link href={"https://www.instagram.com/barragana_lucas/"} className="flex items-center mr-6 hover:scale-110 transition-transform duration-300">
                            <Image src={"/instagram.png"} className="mr-2" width={40} height={40} alt="inst"/>
                            Instagram
                        </Link>
                        <Link href={"https://new-portifolio-tawny.vercel.app/"} className="flex items-center hover:scale-110 transition-transform duration-300">
                            <Image src={"/bear-dev.png"} width={40} height={40} alt="logo" className="mr-2"/>
                            Portifólio
                        </Link>
                    </div>                    
                </div>
                <div className="flex items-center mt-5"> 
                    <div className="w-60 mr-10 hover:scale-110 transition-transform duration-300">
                        <p className="text-2xl">Caso tenha interesse</p>
                        <p className="flex mr-2 ">Ajude na manutenção e evolução do site <Right className="w-14 h-14 "/></p>
                    </div>                    
                    <div className="items-center">
                        <Image src={"/qrcode.jpg"} width={200} height={200} alt="qrcode" />
                    </div>
                </div>
            </div>
            
        </footer>
    )
}