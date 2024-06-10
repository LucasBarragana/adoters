import React from 'react';

export default function Modal({ show, onClose, onConfirm }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
        <p className="mb-4">Você tem certeza que deseja deletar este pet?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
          >
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
}
