'use client'

import Image from "next/image"
import Right from "../../icons/Right"
import Link from "next/link"

export default function Footer() {
    return(
        <footer className="border-t p-8 text-center text-gray-500 mt-16">
            &copy; 2024 Todos direitos reservados - Dev. por Lucas Oliveira Barragana
            <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
                <div className="mb-8 md:mb-0">
                    <h1 className="text-4xl">Contato</h1>
                    <p className="text-2xl mt-2">Email:</p>
                    <p>adoteumpetrs@gmail.com</p>
                    <p>lucasobarragana@gmail.com</p>
                    <div className="flex mt-4 justify-center md:justify-start">
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
                <div className="flex flex-col md:flex-row items-center mt-5">
                    <div className="w-full md:w-60 mb-8 md:mb-0 md:mr-10 hover:scale-110 transition-transform duration-300 text-center md:text-left">
                        <p className="text-2xl">Caso tenha interesse</p>
                        <p className="flex justify-center md:justify-start items-center">Ajude na manutenção e evolução do site <Right className="w-6 h-6 md:w-14 md:h-14 ml-2"/></p>
                    </div>
                    <div className="items-center">
                        <Image src={"/qrcode.jpg"} width={200} height={200} alt="qrcode" />
                    </div>
                </div>
            </div>
        </footer>
    )
}
