'use client';
import Right from "../icons/Right";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero md:mt-4 relative ">
      <div className="py-8 md:py-12 relative z-10">
        <h1 className="text-4xl font-semibold text-white">
          Seja um escolhido<br />
          para ser amado&nbsp;<br />
          <span className="">incondicionalmente</span><br />
          por um 
          <span className="text-red-500 ml-4">
            PETLOVE
          </span>
        </h1>
        <p className="my-6 text-white font-semibold">
          Transforme Vidas com um Ato de Amor Incondicional! 
          Adote um Animal Resgatado e Experimente a Alegria de Fazer a Diferença na Vida de um Ser Especial, 
          Enquanto Ganha um Amigo Fiel e Amoroso para Toda a Vida!
        </p>
        <div className="flex gap-4 text-sm">
          <Link href={'/menu'} className="flex justify-center bg-white uppercase bold font-semibold items-center gap-2 text-secundary px-4 py-2 rounded-full hover:text-blue-500">
            Adoção consciente
            <Right />
          </Link>
        </div>
      </div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 md:block hidden -z-10">
        <Image src={'/pets4.png'} width={400} height={400} alt={'pets'} />
      </div>
    </section>
  );
}
