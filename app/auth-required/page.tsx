"use client";

import { useModal } from "@/app/context/ModalContext"; 

export default function AuthRequired() {
  const { openLogin } = useModal();

  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <h1 className="text-2xl font-bold mb-4">Connexion requise</h1>
        <p className="mb-6">Vous devez être connecté pour accéder à cette page.</p>
        <button
          onClick={openLogin} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}
