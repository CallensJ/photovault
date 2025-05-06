import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface Photo {
  id: string;
  url: string;
  title: string;
  filename: string;
}

const LikedPhotos = () => {
  const [likedPhotos, setLikedPhotos] = useState<Photo[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.username) {
      fetch(`/api/users/${session.user.username}/liked-photos`) // On appelle la nouvelle route pour récupérer les photos likées
        .then((response) => response.json())
        .then((data) => setLikedPhotos(data))
        .catch((error) => console.error("Error fetching liked photos", error));
    }
  }, [session]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Photos que vous avez likées
      </h2>
      {likedPhotos.length > 0 ? (
        likedPhotos.map((photo) => {
          console.log("photo.url:", photo.url); // Vérification du champ 'url'

          // Si le chemin contient déjà '/images/user-uploads/', on n'ajoute rien de plus
          const cleanedUrl = photo.url
            .replace(/^\/?images\//, "")
            .replace(/^user-uploads\//, "");
          const finalPath = `/api/uploads/images/user-uploads/${cleanedUrl}`;
          console.log("Image URL:", finalPath);

          return (
            <div key={photo.id} className="photo-card">
              <Image
                src={`/api/uploads/images/user-uploads/${photo.url
                  .split("/")
                  .pop()}`} // Assurez-vous que `photo.filename` contient le nom du fichier
                alt={photo.title}
                width={300}
                height={350}
                className="rounded-lg object-contain"
              />
            </div>
          );
        })
      ) : (
        <p>Aucune photo likée trouvée.</p>
      )}
    </div>
  );
};

export default LikedPhotos;
