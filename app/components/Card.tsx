"use client";

import Image from "next/image";
import { useState } from "react";
import CardModal from "./modals/CardModal";
import Link from "next/link"; 
interface CardProps {
  id: string;
  imageUrl: string;
  fullImage: string;
  title: string;
  description: string;
  avatarUrl: string;
  username: string;
  views: number;
}

export default function Card({
  id,
  imageUrl,
  username,
  avatarUrl,
  title,
  description,
  views,
}: CardProps) {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  

  return (
    <>
      <div className="max-w-xs w-full">
        <div
          onClick={openModal}
          className="relative h-60 rounded-lg overflow-hidden shadow-lg cursor-pointer group"
        >
          <Image
            src={`/api/protected-image/${id}`}
            alt={title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            fill
            sizes="(max-width: 768px) 100vw, 300px"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
            {title}
          </div>
        </div>

        {/* Infos sous la carte */}
        <div className="mt-2 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            {/* Link ajouté autour de l'avatar */}
            <Link href={`/profile/${username.replace("@", "")}`} passHref>
              <div className="relative w-8 h-8 cursor-pointer">
                <Image
                  src={avatarUrl}
                  alt="Avatar"
                  fill
                  className="rounded-full object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
            </Link>
            <span className="text-sm text-white">@{username}</span>
          </div>
          <span className="text-sm text-gray-300">{views} vues</span>
        </div>
      </div>

      {showModal && (
        <CardModal
          id={id} 
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
