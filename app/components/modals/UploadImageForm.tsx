'use client';
import { useModal } from "@/app/context/ModalContext";
import ImagePicker from "../ImagePicker";

export default function UploadImageForm() {
  const { isUploadImageOpen, closeUploadImage } = useModal();

  if (!isUploadImageOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Upload an image</h2>
        <form>
          <input
            type="text"
            name="title"
            placeholder="Titre *"
            required
            className="w-full mb-2 p-2 border rounded"
          />

          <textarea
            name="description"
            placeholder="Description"
            className="w-full mb-2 p-2 border rounded"
          />

          <button
            type="button"
            onClick={closeUploadImage}
            className="mr-2 px-4 py-2 bg-gray-300 rounded"
          >
            Annuler
          </button>
          <ImagePicker />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}
