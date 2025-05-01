'use client';
import { useState } from "react";
import { useModal } from "@/app/context/ModalContext";
import ImagePicker from "../ImagePicker";
import { useSession } from "next-auth/react"; // Utilisation de useSession

export default function UploadImageForm() {
  const { data: session, status } = useSession();
  const { isUploadImageOpen, closeUploadImage } = useModal();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState("");
  const [pickedImage, setPickedImage] = useState<File | null>(null);
  const [isPremium, setIsPremium] = useState(false); // Nouvel état pour la checkbox premium
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification de la session pour l'utilisateur connecté
    if (status !== "authenticated") {
      alert("Vous devez être connecté pour télécharger une image.");
      return; // Empêcher l'upload si l'utilisateur n'est pas authentifié
    }

    if (!title || !pickedImage) {
      alert("Le titre et l'image sont obligatoires.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("categories", categories);
    formData.append("image", pickedImage);
    formData.append("isPremium", String(isPremium)); // Ajouter le statut premium au formData

    try {
      // Ajout de l'authentification avec le token d'accès
      const res = await fetch("/api/photos", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${session?.accessToken}`, // Utilisation du token d'accès
        },
      });

      if (!res.ok) {
        throw new Error("Échec de l’upload");
      }

      const result = await res.json();
      console.log("Upload réussi :", result);
      closeUploadImage();
    } catch (err) {
      console.error("Erreur lors de l'upload :", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isUploadImageOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Upload an image</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Titre *"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />

          <input
            type="text"
            name="categories"
            placeholder="Catégories (séparées par des virgules)"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />

          <ImagePicker onFileSelected={setPickedImage} />

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="isPremium"
              checked={isPremium}
              onChange={() => setIsPremium(!isPremium)} // Toggle de la checkbox
              className="mr-2"
            />
            <label htmlFor="isPremium">Photo Premium</label>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={closeUploadImage}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {isSubmitting ? "Envoi..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
