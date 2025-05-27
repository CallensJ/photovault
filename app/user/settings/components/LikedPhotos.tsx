import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import CardModal from "@/app/components/modals/CardModal";

interface Photo {
  id: string;
  url: string;
  title: string;
  description?: string;
  username?: string;
  avatarUrl?: string;
}

const LikedPhotos = () => {
  const [likedPhotos, setLikedPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.username) {
      fetch(`/api/users/${session.user.username}/liked-photos`) // Appel pour récupérer les photos likées
        .then((response) => response.json())
        .then((data) => setLikedPhotos(data))
        .catch((error) => console.error("Error fetching liked photos", error));
    }
  }, [session]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Photos que vous avez likées</h2>
      {likedPhotos.length > 0 ? (
        likedPhotos.map((photo) => {
          console.log("photo.url:", photo.url);

          const cleanedUrl = photo.url
            .replace(/^\/?images\//, "")
            .replace(/^user-uploads\//, "");
          const finalPath = `/api/uploads/images/user-uploads/${cleanedUrl}`;
          console.log("Image URL:", finalPath);

          return (
            <div key={photo.id} className="photo-card">
              <Image
                src={finalPath} 
                alt={photo.title}
                width={300}
                height={350}
                onClick={() => setSelectedPhoto(photo)} 
                className="rounded-lg object-contain"
              />
            </div>
          );
        })
      ) : (
        <p>Aucune photo likée trouvée.</p>
      )}
      {/* ✅ CardModal toujours en dehors du ternaire */}
      {selectedPhoto && (
        <CardModal
          id={selectedPhoto.id}
          fullImage={`/api/uploads/images/user-uploads/${selectedPhoto.url.split('/').pop()}`}
          username={selectedPhoto.username || "Utilisateur inconnu"} 
          avatarUrl={selectedPhoto.avatarUrl || "/default-avatar.png"} 
          description={selectedPhoto.description || "Pas de description."} 
          onClose={() => setSelectedPhoto(null)} 
          onDelete={(id) => console.log("delete", id)}
        />
      )}
    </div>
  );
};

export default LikedPhotos;
