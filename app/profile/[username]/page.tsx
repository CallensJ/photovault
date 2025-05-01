"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import CardModal from "@/app/components/modals/CardModal";
import UserProfileFormMsg from "@/app/components/modals/UserProfileFormMsg";

type SelectedImage = {
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
    if (user) {
      setSelectedImage({
        url: photo.url,
        title: photo.title,
        description: photo.description,
        username: user.username,
        avatarUrl: user.avatarUrl,
      });
      setShowModal(true);
    }
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
              {user.photos.map((photo: Photo) => (
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

      {showModal && selectedImage && (
        <CardModal
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
