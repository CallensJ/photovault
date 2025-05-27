"use client"; 
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Card from "./components/Card"; // Assure-toi d'importer le bon composant Card

interface Photo {
  id: string; // Utilise string si l'ID est une chaîne dans ta base de données
  title: string;
  url: string;
  description?: string;
  user: {
    avatar?: string;
    username: string;
  };
  views: number;
  fullImage: string;
}

export default function Home() {
  const { status } = useSession(); // On garde uniquement le status
  const [photos, setPhotos] = useState<Photo[]>([]); // Utilisation du type `Photo` pour les photos

  const handleDeletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };


  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch("/api/photos"); // Appel API pour récupérer les photos
        if (!res.ok) {
          throw new Error("Erreur lors de la récupération des photos");
        }
        const data = await res.json();
        setPhotos(data); // Mise à jour des photos dans l'état
        console.log("Photos récupérées depuis API :", data);
      } catch (error) {
        console.error("Erreur lors du chargement des photos:", error);
      }
    };

    //si l'user est auth on recupere les photos
    if (status === "authenticated") {
      fetchPhotos();
    }
  }, [status]); 

  return (
    <main className="flex flex-wrap gap-4 justify-center pt-16">
      {photos.length === 0 ? (
        <p>Aucune photo disponible pour le moment</p> 
      ) : (
        photos.map((card) => (
          <Card
            key={card.id}
            id={card.id} 
            imageUrl={`/api/protected-image/${card.id}`} 
            title={card.title}
            description={card.description || ""}
            avatarUrl={card.user?.avatar || "/images/avatars/dummy-avatar.png"} 
            username={card.user?.username}
            views={card.views}
            fullImage={`/api/protected-image/${card.id}`}
            onDelete={handleDeletePhoto} // ← 🔥 ici
          />
        ))
      )}
    </main>
  );
}
