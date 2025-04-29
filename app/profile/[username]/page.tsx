"use client";

import { useParams } from "next/navigation";
import { dummyUsers } from "@/app/data/dummyUsers";
import Image from "next/image";
import { useState } from "react";
import CardModal from "@/app/components/modals/CardModal"; // Assurez-vous que le chemin est correct
import UserProfileFormMsg from "@/app/components/modals/UserProfileFormMsg";

export default function ProfilePage() {
  const [isFollowed, setIsFollowed] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const { username } = useParams();

  // On récupère l'utilisateur sans le "@" si l'URL est sans
  const user = dummyUsers.find((u) => u.username.replace("@", "") === username);

  if (!user) {
    return (
      <div className="text-center mt-10 text-red-600">
        Utilisateur non trouvé.
      </div>
    );
  }

  // Gérer l'état de la modale
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
    description: string;
    username: string;
    avatarUrl: string;
  } | null>(null);

  // Fonction pour ouvrir la modale avec l'image sélectionnée
  const openModal = (photo: {
    url: string;
    title: string;
    description: string;
  }) => {
    setSelectedImage({
      url: photo.url,
      title: photo.title,
      description: photo.description,
      username: user.username, // Récupère le nom d'utilisateur de la page de profil
      avatarUrl: user.avatarUrl, // Avatar de l'utilisateur
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
          <Image
            src={user.avatarUrl}
            alt={user.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{user.name}</h1>
          <p className="text-gray-600">{user.username}</p>
          <p className="text-sm text-gray-500">
            {user.city}, {user.country}
          </p>
          {/* Boutons */}
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setIsFollowed((prev) => !prev)}
              className={`px-4 py-2 rounded-lg text-white ${
                isFollowed ? 'bg-green-600' : 'bg-blue-600'
              }`}
            >
              {isFollowed ? "Followed" : "Follow"}
            </button>
            <button
              onClick={() => setShowMessage((prev) => !prev)}
              className="px-4 py-2 rounded-lg bg-gray-600 text-white"
            >
              {showMessage ? "Galerie" : "Message"}
            </button>
          </div>
        </div>
      </div>

      {/* Bio */}
      <p className="mb-6 text-gray-700 italic">{user.bio}</p>





      {/* Galerie OU Message */}
      <div className="mt-6">
        {showMessage ? (
          <UserProfileFormMsg />
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">Galerie</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {user.photos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => openModal(photo)}
                  className="relative w-full h-64 rounded-xl overflow-hidden shadow-md"
                >
                  <Image
                    src={photo.url}
                    alt={photo.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </>
        )}
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
