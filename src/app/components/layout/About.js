'use client';

import React from 'react'
import Image from 'next/image'

const About = () => {
  return (
    <section className="text-center my-16" id="about">
        <h1 className='text-4xl font-semibold underline '>Nosso <span className='text-4xl font-semibold text-secundary'>Propósito</span></h1>
        <div className="absolute left-0 right-0 w-full justify-start">
          <div className="absolute left-0 -top-[70px] text-left -z-10">
            <Image src={'/sadcat.png'} width={109} height={189} alt={'cat'} />
          </div>
          <div className="absolute -top-[100px] right-0 -z-10">
            <Image src={'/saddog.png'} width={107} height={195} alt={'dog'} />
          </div>
        </div>
        <div className="text-gray-900 max-w-4l mx-auto mt-4 flex flex-col gap-4">
          <p>
            Bem-vindo ao nosso portal de adoção e apoio a animais resgatados no Rio Grande do Sul!
          </p>
          <p> 
            Este site foi criado com o objetivo de conectar animais desabrigados e perdidos, vítimas das recentes inundações em nossa região, com pessoas generosas e amorosas que desejam oferecer um novo lar e uma segunda chance a esses seres indefesos. Através deste espaço, os abrigos beneficentes, sem fins lucrativos, podem cadastrar os animais que resgataram, tornando-os visíveis para possíveis adotantes.
          </p>
          <div>
            <p className='mb-2'>Aqui, você encontrará diversas opções para ajudar:</p>
            <ul className='flex text-left'>
              <li className='bg-blue-200 p-2 rounded-lg mx-2'><span className='font-bold'>Adoção de Animais:</span> Navegue pelas páginas de adoção, conheça os animais disponíveis e encontre seu novo melhor amigo.</li>
              <li className='bg-blue-200 p-2 rounded-lg mx-2'><span className='font-bold'>Doações:</span> Contribua com dinheiro, ração, medicamentos e outros itens essenciais para apoiar os abrigos que trabalham incansavelmente para cuidar desses animais.</li>
              <li className='bg-blue-200 p-2 rounded-lg mx-2'><span className='font-bold'>Voluntariado:</span> Descubra oportunidades de se voluntariar e fazer a diferença diretamente nos abrigos.</li>
            </ul>
          </div>              
          <p>  
            Nosso compromisso é promover a adoção responsável e garantir que cada animal encontre um lar cheio de amor e cuidado. Junte-se a nós nesta causa nobre e ajude a transformar vidas, uma adoção por vez.
          </p>
          <p>
            Vamos juntos fazer a diferença para os animais necessitados no Rio Grande do Sul!
          </p>
        </div>
      </section>
  )
}

export default About