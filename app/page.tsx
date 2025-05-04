"use client"; 
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Card from "./components/Card"; // Assure-toi d'importer le bon composant Card

interface Photo {
  id: number; // Change `number` en `string` car `id` est généralement une chaîne dans une base de données
  title: string;
  url: string;
  description?: string; // Description est maintenant optionnelle
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

    // if (status === "authenticated") {
    //   fetchPhotos(); // Récupérer les photos seulement si l'utilisateur est authentifié
    // }
    fetchPhotos();
  }, [status]); // Dépend de `status` pour relancer le `fetch` lorsque la session change

  return (
    <main className="flex flex-wrap gap-4 justify-center pt-16">
      {photos.length === 0 ? (
        <p>Aucune photo disponible pour le moment</p> // Si aucune photo n'est chargée
      ) : (
        photos.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            imageUrl={`/api/protected-image/${card.id}`}// Assure-toi que `url` existe dans les photos
            title={card.title}
            description={card.description || ""} // Si description est undefined, utilise une chaîne vide
            avatarUrl={card.user?.avatar || "/images/avatars/dummy-avatar.png"} // Affiche l'avatar de l'utilisateur
            username={card.user?.username}
            views={card.views}
            fullImage={card.fullImage}
          />
        ))
      )}
    </main>
  );
}
