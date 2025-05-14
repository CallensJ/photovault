"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

export default function AvatarSettings() {
  const { data: session } = useSession();
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const [pickedFile, setPickedFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  // const router = useRouter();

  const handlePickClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPickedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPickedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

const handleSaveAvatar = async () => {
  if (!pickedFile || !session?.user?.username) return;

  const formData = new FormData();
  formData.append("avatar", pickedFile);

  try {
    const res = await fetch(`/api/users/${session.user.username}`, {
      method: "POST",
      body: formData,
    });

    // Vérification du statut HTTP
    if (!res.ok) {
      const errorText = await res.text(); // Lire le texte brut si la réponse n'est pas JSON
      alert(`Erreur : ${errorText || "Échec de l'envoi"}`);
      return;
    }

    // Vérification que la réponse contient bien un JSON valide
    const data = await res.json().catch(() => null); // Essaye de parser JSON, sinon retourne null
    if (!data) {
      alert("Réponse inattendue du serveur");
      return;
    }

    if (data.avatarPath) {
      // Si l'upload est réussi, tu peux mettre à jour l'avatar dans l'interface utilisateur
      alert("Avatar mis à jour");

      // Option 1 : Recharger la page pour appliquer les changements
      window.location.reload();
    } else {
      alert("Erreur lors de l'upload de l'avatar");
    }
  } catch (error) {
    console.error(error);
    alert("Une erreur est survenue lors de l'upload de l'avatar");
  }
};

  return (
    <div className="space-y-4">
      <label className="block text-lg font-semibold">
        Changer votre avatar
      </label>

      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border">
          {pickedImage ? (
            <Image
              src={pickedImage}
              alt="Aperçu"
              fill
              className="object-cover"
            />
          ) : session?.user.avatar ? (
            <Image
              src={session.user.avatar}
              alt="Avatar actuel"
              fill
              className="object-cover"
            />
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
