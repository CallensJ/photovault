"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // Import de useSession
import Image from "next/image";
import CardModal from "@/app/components/modals/CardModal";
import UserProfileFormMsg from "@/app/components/modals/UserProfileFormMsg";

type SelectedImage = {
  id: string;
  url: string;
  title: string;
  description: string;
  username: string;
  avatarUrl: string;
};
type Photo = {
  id: string;
  url: string;
  title: string;
  description: string;
  isPremium: boolean; // Ajout du type isPremium
};

type User = {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  city: string;
  country: string;
  photos: Photo[];
};

export default function ProfilePage() {
  const { username } = useParams();
  const { data: session } = useSession(); // Récupération de la session
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowed, setIsFollowed] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${username}`);
        if (!res.ok) throw new Error("Utilisateur non trouvé");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchUser();
  }, [username]);
  const openModal = (photo: Photo) => {
    if (!photo.url) {
      console.error('URL de la photo manquante');
      return;
    }
    if (!user) return;  // Si 'user' est null, on arrête la fonction
    console.log("Photo URL:", photo.url);
    // Vérifie si l'utilisateur est autorisé à voir la photo (si c'est une photo premium)
    const isOwner = session?.user.username === user.username; // Vérifie si l'utilisateur est le propriétaire
    const isPremium = photo.isPremium && !isOwner; // Si la photo est premium et que l'utilisateur n'est pas propriétaire
    
    // Si la photo est premium mais que l'utilisateur n'est pas connecté ou n'a pas l'abonnement premium, on ne permet pas l'ouverture
    if (isPremium && (!session?.user || !session?.user.isPremium)) {
      alert("Accès refusé, photo premium réservée aux utilisateurs premium");
      return; // Empêche l'ouverture de la modale
    }
  
    // Si l'utilisateur est autorisé (soit photo non-premium, soit il est connecté et premium)
    setSelectedImage({
      id: photo.id,
      url: photo.url,
      title: photo.title,
      description: photo.description,
      username: user.username,
      avatarUrl: user.avatarUrl,
    });
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

  if (!user)
    return (
      <p className="text-center mt-10 text-red-600">Utilisateur non trouvé.</p>
    );

  return (
    <div className="max-w-5xl mx-auto mt-6 px-4 pb-7 pt-7">
      <div className="flex items-center gap-4 mb-6 pb-7">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white -mt-16">
          <Image
            src={user.avatarUrl || "/images/avatars/dummy-avatar.png"}
            alt={user.name || "Avatar de l'utilisateur"}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{user.name}</h1>
          <p className="text-gray-600">@{user.username}</p>
          <p className="text-sm text-gray-500">
            {user.city}, {user.country}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setIsFollowed((prev) => !prev)}
              className={`px-4 py-2 rounded-lg text-white ${
                isFollowed ? "bg-green-600" : "bg-blue-600"
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

      <p className="mb-6 text-gray-700 italic">{user.bio}</p>

      <div className="mt-6">
        {showMessage ? (
          <UserProfileFormMsg />
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">Galerie</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {user.photos.map((photo: Photo) => {
                // On vérifie si l'image est premium et si l'utilisateur connecté est différent du propriétaire
                const isOwner = session?.user.username === user.username;
                const isPremium = photo.isPremium && !isOwner;

                return (
                  <div
                    key={photo.id}
                    onClick={() => openModal(photo)}
                    className="relative w-full h-64 rounded-xl overflow-hidden shadow-md"
                  >
                    <Image
                         // Utilise l'ID ici pour appeler l'API
                      // src={photo.url}
                      src={`/api/protected-image/${photo.id}`}
                      alt={photo.title}
                      fill
                      className={`object-cover ${isPremium ? "filter blur-sm" : ""}`} // Floutage si photo premium
                    />
                    {isPremium && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-lg">
                        Veuillez souscrire pour voir cette image
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {showModal && selectedImage && (
        <CardModal
          id={selectedImage?.id}
          fullImage={selectedImage.url}
          username={selectedImage.username}
          avatarUrl={selectedImage.avatarUrl}
          description={selectedImage.description}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
