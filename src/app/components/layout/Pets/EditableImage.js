import Image from "next/image";
import toast from "react-hot-toast";

export default function EditableImage({ link, setLink }) {

  async function handleFileChange(ev) {
    const files = ev.target.files;
    if (files?.length === 1) {
      const data = new FormData();
      data.set('file', files[0]);

      const uploadPromise = fetch('/api/upload', {
        method: 'POST',
        body: data,
      }).then(response => {
        if (response.ok) {
          return response.json().then(link => {
            setLink(link);
          });
        }
        throw new Error('Ocorreu um erro');
      });

      await toast.promise(uploadPromise, {
        loading: 'Carregando...',
        success: 'Imagem Salva',
        error: 'Ocorreu um problema',
      });
    }
  }

  return (
    <div className="flex items-center justify-center">
      <label className="cursor-pointer mb-2">
        <input type="file" className="hidden" onChange={handleFileChange} />
        <span className="block border border-gray-300 rounded-lg p-2 text-center cursor-pointer bg-white text-gray-300">Inserir/Trocar imagem</span>
      </label>
      {link ? (
        <Image className="rounded-lg mb-2" src={link} width={50} height={50} alt={'avatar'} />
      ) : (
        <div className="bg-gray-200 p-4 text-gray-500 rounded-lg mb-2 text-center w-32 ml-4">
          Sem imagem
        </div>
      )}
    </div>
  );
}
