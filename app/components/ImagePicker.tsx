'use client';
import { useRef, useState } from "react";
import Image from "next/image";

interface ImagePickerProps {
  onFileSelected: (file: File | null) => void;
}

export default function ImagePicker({ onFileSelected }: ImagePickerProps) {
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handlePickClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPickedImage(null);
      onFileSelected(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPickedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    onFileSelected(file); // Passe le fichier au parent
  };

  return (
    <div className="space-y-4">
      <label className="block text-lg font-semibold">Upload image</label>

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
            type="button"
            onClick={handlePickClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Choisir une image
          </button>
        </div>
      </div>
    </div>
  );
}
