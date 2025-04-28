// /app/components/Card.tsx
"use client";

import Image from "next/image";
import React, { useState } from "react";
import { FaHeart, FaDownload, FaEllipsisH } from "react-icons/fa";

interface CardProps {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  avatarUrl: string;
  username: string;
  views: number;
  fullImage: string;
}

interface Comment {
  id: number;
  avatarUrl: string;
  username: string;
  text: string;
}

export default function Card({
  imageUrl,
  title,
  description,
  avatarUrl,
  username,
  views,
  fullImage,
}: CardProps) {
  const [showModal, setShowModal] = useState(false);
  const [likes, setLikes] = useState(0);
  const [downloads, setDownloads] = useState(0);
  const [dropdownVisible, setDropdownVisible] = useState(false); // Gérer la visibilité du menu
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Option sélectionnée
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [openMenuCommentId, setOpenMenuCommentId] = useState<number | null>(
    null
  );

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleDownload = () => {
    setDownloads(downloads + 1);
    // Ajoute la logique de téléchargement de l'image ici si nécessaire
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setDropdownVisible(false); // Fermer le menu après sélection
    console.log(`Option sélectionnée: ${option}`);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleAddComment = () => {
    if (newComment.trim() !== "") {
      const newCommentObj: Comment = {
        id: Date.now(), // ID unique simple (timestamp)
        avatarUrl: "/images/default-avatar.png", // À remplacer plus tard avec user connecté
        username: "guestUser", // Idem
        text: newComment,
      };
      setComments((prevComments) => [...prevComments, newCommentObj]);
      setNewComment("");
    }
  };
  const handleDeleteComment = (id: number) => {
    setComments((prevComments) => prevComments.filter((c) => c.id !== id));
  };

  const handleReportComment = (id: number) => {
    alert("Merci d'avoir signalé ce commentaire. Nous allons l'examiner !");
    // Plus tard, tu pourras envoyer l'info au serveur ici
  };
  const toggleMenu = (id: number) => {
    if (openMenuCommentId === id) {
      setOpenMenuCommentId(null); // Ferme si déjà ouvert
    } else {
      setOpenMenuCommentId(id); // Ouvre ce menu
    }
  };
  return (
    <>
      {/* Card */}
      <div className="w-[300px] rounded-lg overflow-hidden bg-white shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl">
        <div
          className="relative w-full h-48 cursor-pointer"
          onClick={openModal}
        >
          <Image
            src={imageUrl}
            alt={title}
            className="object-cover"
            fill
            priority
          />
        </div>

        <div className="p-4">
          {/* Header: Avatar + Views */}
          <div className="flex justify-between items-center mb-2">
            <a href={`/profile/${username}`} className="relative w-10 h-10">
              <Image
                src={avatarUrl}
                alt="Avatar"
                className="rounded-full object-cover"
                fill
              />
            </a>
            <span className="text-sm text-gray-500">👁️ {views} vues</span>
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

          {/* Description */}
          {/* <p className="text-gray-600 mt-2 text-sm">{description}</p> */}
        </div>
      </div>

      {/* Modal (en dehors de la carte) */}
      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={closeModal} // Clic sur le fond pour fermer la modale
        >
          <div
            className="bg-[#282c34] max-w-3xl w-[90%] max-h-[90%] overflow-y-auto rounded-xl p-6 relative"
            onClick={(e) => e.stopPropagation()} // Empêche la propagation du clic à la div parente
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-3xl z-60"
            >
              &times;
            </button>

            <div className="relative w-full h-[80vh] mb-6">
              <Image
                src={fullImage}
                alt="Full Image"
                className="rounded-lg object-contain w-full h-full"
                fill
                priority
              />
            </div>

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
            <p className="text-gray-300 mb-4">{description}</p>

            {/* categories bloc */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-gray-300 text-gray-700 rounded-full py-1 px-3 text-xs">
                #nature
              </span>
              <span className="bg-gray-300 text-gray-700 rounded-full py-1 px-3 text-xs">
                #montagnes
              </span>
            </div>

            {/* Like and Download Buttons */}
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

            {/* Options Dropdown */}
            <div className="absolute top-4 left-4">
              <button onClick={toggleDropdown} className="text-white">
                <FaEllipsisH size={24} />
              </button>
              {/* Le menu déroulant */}
              {dropdownVisible && (
                <ul className="absolute top-10 left-0 bg-white shadow-lg rounded-lg p-2 text-gray-700">
                  <li
                    onClick={() => handleOptionSelect("report")}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    Reporter
                  </li>
                  <li
                    onClick={() => handleOptionSelect("favorite")}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    Ajouter aux favoris
                  </li>
                </ul>
              )}
            </div>

            {/* Liste des commentaires */}
            <div className="mt-6 space-y-4 pb-6">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-700 text-white p-3 rounded-lg flex items-start justify-between"
                >
                  {/* Avatar + User */}
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

                  {/* Dropdown pour reporter/supprimer */}
                  <div className="relative comment-menu group">
                    <button
                      onClick={() => toggleMenu(comment.id)}
                      className="text-gray-400 hover:text-white text-xl"
                    >
                      ⋮
                    </button>
                    {openMenuCommentId === comment.id && (
                      <ul className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg py-2 z-10 transition-all duration-200 ease-out scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100">
                        <li
                          onClick={() => {
                            handleReportComment(comment.id);
                            setOpenMenuCommentId(null);
                          }}
                          className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-sm"
                        >
                          🚩 Reporter
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
      )}
    </>
  );
}
