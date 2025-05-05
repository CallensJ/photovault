import { useState } from "react";
import { FaHeart } from "react-icons/fa";

interface LikeButtonProps {
    photoId: string;
    userEmail?: string; // ← accepte string OU undefined
  }
function LikeButton({ photoId, userEmail }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);

  const handleClick = async () => {
    try {
      const method = liked ? "DELETE" : "POST";

      await fetch(`/api/photos/${photoId}/like`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail }),
      });

      setLiked(!liked); // on ne modifie le state qu'après confirmation
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
    />
  );
}

export default LikeButton;
