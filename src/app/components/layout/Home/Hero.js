'use client';
import Right from "../../icons/Right";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="hero" className="hero mt-8 md:mt-4 relative px-4 sm:px-6 lg:px-8">          
      <div className="fixed inset-0 flex items-center justify-center mt-40 ml-12 custom-container">
        <Image 
          src={'/pets4.png'} 
          width={300} 
          height={300} 
          alt={'pets'} 
          className="opacity-10 sm:opacity-0 md:opacity-0 lg:opacity-0"
        />
      </div>
      <div className="py-8 z-100 md:py-12 relative z-10 text-center md:text-left z-100">
        <h1 className="text-3xl md:text-4xl font-semibold text-white">
          Seja um escolhido<br />
          para ser amado&nbsp;<br />
          <span className="">incondicionalmente</span><br />
          por um 
          <span className="text-red-500 ml-0 md:ml-4">
            PETLOVE
          </span>
        </h1>
        <p className="my-4 md:my-6 text-white font-semibold">
          Transforme Vidas com um Ato de Amor Incondicional! 
          Adote um Animal Resgatado e Experimente a Alegria de Fazer a Diferença na Vida de um Ser Especial, 
          Enquanto Ganha um Amigo Fiel e Amoroso para Toda a Vida!
        </p>
        <div className="flex justify-center md:justify-start gap-4 text-sm">
          <Link href={'/pages/adoption'} className="flex justify-center bg-white uppercase bold font-semibold items-center gap-2 text-secondary px-4 py-2 rounded-full hover:text-blue-500">
            Adoção consciente
            <Right />
          </Link>
        </div>
      </div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 md:block hidden -z-10">
        <Image src={'/pets4.png'} width={400} height={400} alt={'pets'} className="hidden md:block"/>
      </div>      
    </section>
  );
}
