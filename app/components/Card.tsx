// /app/components/Card.tsx
"use client";

import Image from "next/image";
import React, { useState } from "react";

interface CardProps {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  avatarUrl: string;
  username: string;
  views: number;
  fullImage: string;
}

export default function Card({
  
  imageUrl,
  title,
  description,
  avatarUrl,
  username,
  views,
  fullImage,
}: CardProps) {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      {/* Card */}
      <div className="w-[300px] rounded-lg overflow-hidden bg-white shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl">
        <div className="relative w-full h-48 cursor-pointer" onClick={openModal}>
            <Image
            
            src={imageUrl}
            alt={title}
            className="object-cover"
            fill
            priority
          />
        </div>

        <div className="p-4">
          {/* Header: Avatar + Views */}
          <div className="flex justify-between items-center mb-2">
            <a href={`/profile/${username}`} className="relative w-10 h-10">
              <Image
                src={avatarUrl}
                alt="Avatar"
                className="rounded-full object-cover"
                fill
              />
            </a>
            <span className="text-sm text-gray-500">👁️ {views} vues</span>
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

          {/* Description */}
          <p className="text-gray-600 mt-2 text-sm">{description}</p>
        </div>
      </div>

      {/* Modal (en dehors de la carte) */}
 {/* Modal */}
{showModal && (
  <div
    className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
    onClick={closeModal} // Clic sur le fond pour fermer la modale
  >
    <div
      className="bg-[#282c34] max-w-3xl w-[90%] max-h-[90%] overflow-y-auto rounded-xl p-6 relative"
      onClick={(e) => e.stopPropagation()} // Empêche la propagation du clic à la div parente
    >
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-white text-3xl z-60"
      >
        &times;
      </button>

      <div className="relative w-full h-[80vh] mb-6">
        <Image
          src={fullImage}
          alt="Full Image"
          className="rounded-lg object-contain w-full h-full"
          fill
          priority
        />
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-12 h-12">
          <Image
            src={avatarUrl}
            alt="Avatar"
            className="rounded-full object-cover"
            fill
          />
        </div>
        <span className="text-white">@{username}</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="bg-gray-300 text-gray-700 rounded-full py-1 px-3 text-xs">
          #nature
        </span>
        <span className="bg-gray-300 text-gray-700 rounded-full py-1 px-3 text-xs">
          #montagnes
        </span>
      </div>

      <div>
        <textarea
          className="w-full p-3 rounded-lg bg-gray-600 text-white resize-none mb-3"
          placeholder="Ajoutez un commentaire..."
          rows={4}
        />
        <button className="bg-gray-800 text-white py-2 px-4 rounded-lg">
          Commenter
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
}
