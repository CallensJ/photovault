'use client';

import { useParams } from 'next/navigation';
import { dummyUsers } from '@/app/data/dummyUsers';
import Image from 'next/image';
import { useState } from 'react';
import CardModal from '@/app/components/modals/CardModal'; // Assurez-vous que le chemin est correct

export default function ProfilePage() {
  const { username } = useParams();

  // On récupère l'utilisateur sans le "@" si l'URL est sans
  const user = dummyUsers.find((u) => u.username.replace('@', '') === username);

  if (!user) {
    return <div className="text-center mt-10 text-red-600">Utilisateur non trouvé.</div>;
  }

  // Gérer l'état de la modale
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string; description: string; username: string; avatarUrl: string } | null>(null);

  // Fonction pour ouvrir la modale avec l'image sélectionnée
  const openModal = (photo: { url: string; title: string; description: string }) => {
    setSelectedImage({
      url: photo.url,
      title: photo.title,
      description: photo.description,
      username: user.username,  // Récupère le nom d'utilisateur de la page de profil
      avatarUrl: user.avatarUrl // Avatar de l'utilisateur
    });
    setShowModal(true);
  };

  // Fonction pour fermer la modale
  const closeModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  return (
    <div className="max-w-5xl mx-auto mt-6 px-4 pb-7 pt-7">
      {/* Avatar + infos */}
      <div className="flex items-center gap-4 mb-6 pb-7">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white -mt-16">
          <Image src={user.avatarUrl} alt={user.name} fill className="object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{user.name}</h1>
          <p className="text-gray-600">{user.username}</p>
          <p className="text-sm text-gray-500">{user.city}, {user.country}</p>
        </div>
      </div>

      {/* Bio */}
      <p className="mb-6 text-gray-700 italic">{user.bio}</p>

      {/* Galerie */}
      <h2 className="text-xl font-bold mb-4">Galerie</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {user.photos.map((photo) => (
          <div
            key={photo.id}
            className="relative w-full h-64 rounded-xl overflow-hidden shadow-md cursor-pointer"
            onClick={() => openModal(photo)} // Ouvrir la modale au clic sur l'image
          >
            <Image
              src={photo.url}
              alt={photo.title}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 bg-black bg-opacity-60 text-white text-sm p-2 w-full">
              <strong>{photo.title}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Affichage de la modale si showModal est true */}
      {showModal && selectedImage && (
        <CardModal
          fullImage={selectedImage.url}
          username={selectedImage.username}
          avatarUrl={selectedImage.avatarUrl}
          description={selectedImage.description}
          onClose={closeModal} // Fermer la modale
        />
      )}
    </div>
  );
}
