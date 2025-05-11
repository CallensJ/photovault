'use client';

import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";

interface LikeButtonProps {
  photoId: string;
  userEmail?: string;
}

function LikeButton({ photoId, userEmail }: LikeButtonProps) {
  const [liked, setLiked] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    const fetchInitialLike = async () => {
      if (!userEmail) return;

      try {
        const res = await fetch(`/api/photos/${photoId}/like?userEmail=${userEmail}`);
        const data = await res.json();
        setLiked(data.liked); // ← true ou false
      } catch (error) {
        console.error("Erreur lors de la récupération du like :", error);
      }
    };

    fetchInitialLike();
  }, [photoId, userEmail]);
const handleClick = async () => {
  if (!userEmail || liked === null) return;

  try {
    const method = liked ? "DELETE" : "POST"; // Si liké, alors on fait un DELETE, sinon un POST.

    const response = await fetch(`/api/photos/${photoId}/like`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userEmail }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'ajout ou retrait du like');
    }

    const data = await response.json();
    setLiked(data.likes); 

    // Mets à jour l'état en fonction du résultat
    if (liked) {
      // Si on a cliqué sur "unlike"
      setLiked(false);
    } else {
      // Si on a cliqué sur "like"
      setLiked(true);
    }

    // Mets à jour le nombre de likes dans l'interface (si tu veux le faire)
    // setLikes(data.likes); // Exemple si tu gères les likes dans un autre état
  } catch (error) {
    console.error("Erreur lors du like/unlike :", error);
  }
};

  return (
    <FaHeart
      color={liked ? "red" : "white"}
      size={50}
      onClick={handleClick}
      className="cursor-pointer"
      style={{ opacity: liked === null ? 0.5 : 1 }}
    />
  );
}

export default LikeButton;
