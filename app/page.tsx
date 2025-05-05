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

    // Si l'utilisateur est authentifié, on récupère les photos
    if (status === "authenticated") {
      fetchPhotos();
    }
  }, [status]); // Dépend de `status` pour relancer le `fetch` lorsque la session change

  return (
    <main className="flex flex-wrap gap-4 justify-center pt-16">
      {photos.length === 0 ? (
        <p>Aucune photo disponible pour le moment</p> // Si aucune photo n'est chargée
      ) : (
        photos.map((card) => (
          <Card
            key={card.id}
            id={card.id} // ID est maintenant une string
            imageUrl={`/api/protected-image/${card.id}`} 
            title={card.title}
            description={card.description || ""} // Si description est undefined, utilise une chaîne vide
            avatarUrl={card.user?.avatar || "/images/avatars/dummy-avatar.png"} // Affiche l'avatar de l'utilisateur
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
