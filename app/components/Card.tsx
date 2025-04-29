"use client";

import Image from "next/image";
import { useState } from "react";
import CardModal from "./modals/CardModal";

interface CardProps {
  id: number;
  imageUrl: string;
  fullImage: string;
  title: string;
  description: string;
  avatarUrl: string;
  username: string;
  views: number;
}

export default function Card({ imageUrl, username, avatarUrl,title,description }: CardProps) {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <div
        onClick={openModal}
        className="relative w-full h-60 rounded-lg overflow-hidden shadow-lg cursor-pointer group"
      >
        <Image
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          fill
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
          {title}
        </div>
      </div>

      {showModal && (
        <CardModal
          fullImage={imageUrl}
          username={username}
          avatarUrl={avatarUrl}
          description={description}
          onClose={closeModal}
        />
      )}
    </>
  );
}
