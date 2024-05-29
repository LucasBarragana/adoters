'use client';
import Right from "../icons/Right";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero md:mt-4">
      <div className="py-8 md:py-12">
        <h1 className="text-4xl font-semibold">
          Seja um escolhido<br />
          para ser amado&nbsp;<br />
          <span className="">incondicionalmente</span><br />
          por um 
          <span className="text-secundary ml-4">
            PETLOVE
          </span>
        </h1>
        <p className="my-6 text-gray-500 font-semibold ">
        Transforme Vidas com um Ato de Amor Incondicional! 
        Adote um Animal Resgatado e Experimente a Alegria de Fazer a Diferença na Vida de um Ser Especial, 
        Enquanto Ganha um Amigo Fiel e Amoroso para Toda a Vida!
        </p>
        <div className="flex gap-4 text-sm">
        <Link href={'/menu'} className="flex justify-center bg-secundary uppercase bold flex items-center gap-2 text-white px-4 py-2 rounded-full hover:bg-hoverSecundary">
          Adoção consciente
          <Right />
        </Link>
        </div>
      </div>
      <div className="relative hidden md:block">
        <Image className="ml-24" src={'/pets4.png'} width={300} height={300} alt={'pets'} />
      </div>
    </section>
  );
}