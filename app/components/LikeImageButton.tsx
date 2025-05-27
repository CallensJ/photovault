"use client";
//https://stackoverflow.com/questions/73520153/im-fetching-data-from-an-api-in-an-async-function-in-react-and-it-works-fine-b

import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";

interface LikeButtonProps {
  photoId: string;
  userEmail?: string;
}

function LikeButton({ photoId, userEmail }: LikeButtonProps) {
  const [liked, setLiked] = useState<boolean | null>(null);

  //1 on check si l'user a deja like la photo ou non
  useEffect(() => {
    const fetchInitialLike = async () => {
      if (!userEmail) return;
      //2 on recupere la photo si elle est like
      try {
        const res = await fetch(
          `/api/photos/${photoId}/like?userEmail=${userEmail}`
        );
        console.log(res);
        const data = await res.json();
        setLiked(data.liked);
      } catch (error) {
        console.error("erreur lors de la recuperation du like", error);
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
        throw new Error("erreur lors de lajout ou retrait du like");
      }

      const data = await response.json();
      setLiked(data.likes);

      if (liked) {
        // Si on a cliqué sur "unlike"
        setLiked(false);
      } else {
        // Si on a cliqué sur "like"
        setLiked(true);
      }
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
