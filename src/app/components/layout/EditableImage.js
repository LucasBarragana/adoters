'use client';
import Image from "next/image";
import toast from "react-hot-toast";

export default function EditableImage({link, setLink}) {

  async function handleFileChange(ev) {
    const files = ev.target.files;
    if (files?.length === 1) {
      const data = new FormData;
      data.set('file', files[0]);

      const uploadPromise = fetch('/api/upload', {
        method: 'POST',
        body: data,
      }).then(response => {
        if (response.ok) {
          return response.json().then(link => {
            setLink(link);
          })
        }
        throw new Error('Ocorreu um erro');
      });

      await toast.promise(uploadPromise, {
        loading: 'Uploading...',
        success: 'Upload completo',
        error: 'Upload error',
      });
    }
  }

  return (
    <>
      <label className="mr-4 cursor-pointer">
        <input type="file" className="hidden" onChange={handleFileChange} />
        <span className="block border border-gray-300 rounded-lg p-2 text-center cursor-pointer bg-white text-grat-300">Inserir/Trocar imagem</span>
      </label>     
      {link && (
        <Image className="rounded-lg mb-1" src={link} width={50} height={50} alt={'avatar'} />
      )}
      {!link && (
        <div className="text-center bg-gray-200 p-4 text-gray-500 rounded-lg mb-1">
          Sem imagem
        </div>
      )}       
    </>
  );
}