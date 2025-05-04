"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function AvatarSettings() {
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const [pickedFile, setPickedFile] = useState<File | null>(null);
  const { data: session, update } = useSession();  // Hook de session
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handlePickClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPickedImage(null);
      setPickedFile(null);
      return;
    }

    setPickedFile(file);

    //https://developer.mozilla.org/en-US/docs/Web/API/FileReader

    const reader = new FileReader();
    reader.onload = () => {
      setPickedImage(reader.result as string);
    };
    reader.readAsDataURL(file); //lis en base64
  };

  const handleSaveAvatar = async () => {
    if (!pickedFile) {
      alert("Aucune image sélectionnée");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", pickedFile);

    try {
      // Vérifie si la session est disponible
      if (!session) {
        alert("Utilisateur non authentifié !");
        return;
      }

      // Envoi de l'avatar à l'API pour mise à jour
      const response = await fetch(`/api/users/${session.user.username}/upload-avatar`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Si l'upload est réussi, mettre à jour la session avec le nouvel avatar
        const updatedSession = await response.json();
        if (updatedSession?.avatar) {
          // Mettre à jour la session avec l'avatar mis à jour
          update({
            user: {
              ...session.user,
              avatar: updatedSession.avatar,  // Mettre à jour l'avatar
            },
          });
          alert("Avatar mis à jour !");
        }
      } else {
        alert("Échec de la mise à jour de l'avatar");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'avatar :", error);
      alert("Erreur lors de la mise à jour de l'avatar");
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-lg font-semibold">Changer votre avatar</label>

      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border">
          {pickedImage ? (
            <Image src={pickedImage} alt="Aperçu" fill className="object-cover" />
          ) : (
            <p className="text-sm text-gray-500 flex items-center justify-center w-full h-full text-center">
              Aucune image
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={imageInputRef}
            onChange={handleImageChange}
          />
          <button
            onClick={handlePickClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Choisir une image
          </button>

          {pickedImage && (
            <button
              onClick={handleSaveAvatar}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Sauvegarder l’avatar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
