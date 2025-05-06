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
      const method = liked ? "DELETE" : "POST";

      await fetch(`/api/photos/${photoId}/like`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail }),
      });

      setLiked(!liked);
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
