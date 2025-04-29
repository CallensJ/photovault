"use client";

import Image from "next/image";
import { useState } from "react";
import { FaHeart, FaDownload, FaEllipsisH } from "react-icons/fa";

interface CardModalProps {
  fullImage: string;
  username: string;
  avatarUrl: string;
  description: string;
  onClose: () => void;
}

interface Comment {
  id: number;
  avatarUrl: string;
  username: string;
  text: string;
}

export default function CardModal({
  fullImage,
  username,
  avatarUrl,
  description,
  onClose,
}: CardModalProps) {
  const [likes, setLikes] = useState(0);
  const [downloads, setDownloads] = useState(0);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [openMenuCommentId, setOpenMenuCommentId] = useState<number | null>(
    null
  );

  const handleLike = () => setLikes(likes + 1);

  const handleDownload = () => {
    setDownloads(downloads + 1);
    // Ajoute ici ta logique de téléchargement si besoin
  };

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const handleOptionSelect = (option: string) => {
    setDropdownVisible(false);
    alert(`Option sélectionnée: ${option}`);
  };

  const handleAddComment = () => {
    if (newComment.trim() !== "") {
      const newCommentObj: Comment = {
        id: Date.now(),
        avatarUrl: "/images/default-avatar.png",
        username: "guestUser",
        text: newComment,
      };
      setComments((prev) => [...prev, newCommentObj]);
      setNewComment("");
    }
  };

  const handleDeleteComment = (id: number) =>
    setComments((prev) => prev.filter((c) => c.id !== id));

  const handleReportComment = () => {
    alert("Merci d’avoir signalé ce commentaire !");
  };

  const toggleMenu = (id: number) => {
    setOpenMenuCommentId(openMenuCommentId === id ? null : id);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#282c34] max-w-3xl w-[90%] max-h-[90%] overflow-y-auto rounded-xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl"
        >
          &times;
        </button>

        {/* Image principale */}
        <div className="relative w-full h-[80vh] mb-6">
          <Image
            src={fullImage}
            alt="Image"
            className="rounded-lg object-contain"
            fill
            priority
          />
        </div>

        {/* Auteur */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-12 h-12">
            <Image
              src={avatarUrl}
              alt="Avatar"
              className="rounded-full object-cover"
              fill
            />
          </div>
          <span className="text-white">@{username}</span>
        </div>

        {/* Description */}
        <p className="text-gray-300 mb-4">{description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-gray-300 text-gray-700 rounded-full py-1 px-3 text-xs">
            #nature
          </span>
          <span className="bg-gray-300 text-gray-700 rounded-full py-1 px-3 text-xs">
            #photo
          </span>
        </div>

        {/* Like / Download */}
        <div className="flex gap-6 mb-4">
          <div className="flex flex-col items-center">
            <button
              onClick={handleLike}
              className="text-red-500 hover:text-red-700"
            >
              <FaHeart size={24} />
            </button>
            <span className="text-white">{likes} Likes</span>
          </div>
          <div className="flex flex-col items-center">
            <button
              onClick={handleDownload}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaDownload size={24} />
            </button>
            <span className="text-white">{downloads} Downloads</span>
          </div>
        </div>

        {/* Dropdown général */}
        <div className="absolute top-4 left-4">
          <button onClick={toggleDropdown} className="text-white">
            <FaEllipsisH size={24} />
          </button>
          {dropdownVisible && (
            <ul className="absolute top-10 left-0 bg-white shadow-lg rounded-lg p-2 text-gray-700">
              <li
                onClick={() => handleOptionSelect("report")}
                className="p-2 cursor-pointer hover:bg-gray-200"
              >
                🚩 Signaler l’image
              </li>
              <li
                onClick={() => handleOptionSelect("favorite")}
                className="p-2 cursor-pointer hover:bg-gray-200"
              >
                ⭐ Ajouter aux favoris
              </li>
            </ul>
          )}
        </div>

        {/* Commentaires */}
        <div className="mt-6 space-y-4 pb-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-700 text-white p-3 rounded-lg flex items-start justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8">
                  <Image
                    src={comment.avatarUrl}
                    alt="Avatar"
                    className="rounded-full object-cover"
                    fill
                  />
                </div>
                <div>
                  <p className="font-semibold">@{comment.username}</p>
                  <p className="text-sm">{comment.text}</p>
                </div>
              </div>

              {/* Menu Commentaire */}
              <div className="relative group">
                <button
                  onClick={() => toggleMenu(comment.id)}
                  className="text-xl text-gray-400"
                >
                  ⋮
                </button>
                {openMenuCommentId === comment.id && (
                  <ul className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg py-2 z-10">
                    <li
                      onClick={() => {
                        handleReportComment();
                        setOpenMenuCommentId(null);
                      }}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-sm"
                    >
                      🚩 Signaler
                    </li>
                    <li
                      onClick={() => {
                        handleDeleteComment(comment.id);
                        setOpenMenuCommentId(null);
                      }}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-sm"
                    >
                      🗑️ Supprimer
                    </li>
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Zone d'ajout de commentaire */}
        <div>
          <textarea
            className="w-full p-3 rounded-lg bg-gray-600 text-white resize-none mb-3"
            placeholder="Ajoutez un commentaire..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
          />
          <button
            onClick={handleAddComment}
            className="bg-gray-800 text-white py-2 px-4 rounded-lg"
          >
            Commenter
          </button>
        </div>
      </div>
    </div>
  );
}
