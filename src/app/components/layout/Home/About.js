'use client';

import React from 'react';
import Image from 'next/image';

const About = () => {
  return (
    <section className="text-center mt-[80px] px-4 sm:px-6 md:px-8" id="about">
      <h1 className='text-gray-700 text-4xl font-semibold sm:text-white text-4xl font-semibold md:text-gray-700 text-4xl font-semibold lg:text-gray-700e text-4xl font-semibold'>
        Nosso Propósito
      </h1>
      <div className="relative w-full flex justify-center mt-4 top-44 opacity-10 sm:opacity-10 -z-1 md:opacity-10 -z-1 lg:opacity-100">
        <div className="absolute left-0  transform -translate-y-100 -translate-x-10 md:-translate-y-20">
          <Image src={'/pet1.png'} width={107} height={195} className='w-20' alt={'cat'} />
        </div>
        <div className="absolute right-0  transform -translate-y-100 translate-x-10 md:-translate-y-20">
          <Image src={'/pet2.png'} width={107} height={195} className='w-24' alt={'dog'} />
        </div>
      </div>
      <div className=" max-w-4xl mx-auto mt-4 flex flex-col gap-4 z-100">
        <div className='text-gray-900'>
          <p className=''>
            Bem-vindo ao nosso portal de adoção e apoio a animais resgatados no Rio Grande do Sul!
          </p>
          <p>
            Este site foi criado com o objetivo de conectar animais desabrigados e perdidos, vítimas das recentes inundações em nossa região, com pessoas generosas e amorosas que desejam oferecer um novo lar e uma segunda chance a esses seres indefesos. Através deste espaço, os abrigos beneficentes, sem fins lucrativos, podem cadastrar os animais que resgataram, tornando-os visíveis para possíveis adotantes.
          </p>
        </div>        
        <div className=''>
          <p className='text-gray-900 mb-2'>Aqui, você encontrará diversas opções para ajudar:</p>
          <ul className='text-left flex flex-col sm:flex-row gap-2 sm:gap-4'>
            <li className='bg-blue-200 p-2 rounded-lg'>
              <span className='font-bold'>Adoção de Animais:</span> Navegue pelas páginas de adoção, conheça os animais disponíveis e encontre seu novo melhor amigo.
            </li>
            <li className='bg-blue-200 p-2 rounded-lg'>
              <span className='font-bold'>Doações:</span> Contribua com dinheiro, ração, medicamentos e outros itens essenciais para apoiar os abrigos que trabalham incansavelmente para cuidar desses animais.
            </li>
            <li className='bg-blue-200 p-2 rounded-lg'>
              <span className='font-bold'>Voluntariado:</span> Descubra oportunidades de se voluntariar e fazer a diferença diretamente nos abrigos.
            </li>
          </ul>
        </div>
        <p className='text-gray-800'>
          Nosso compromisso é promover a adoção responsável e garantir que cada animal encontre um lar cheio de amor e cuidado. Junte-se a nós nesta causa nobre e ajude a transformar vidas, uma adoção por vez.
        </p>
        <p>
          Vamos juntos fazer a diferença para os animais necessitados no Rio Grande do Sul!
        </p>
      </div>
    </section>
  );
}

export default About;
