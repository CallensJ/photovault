import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface Photo {
  id: string;
  url: string;
  title: string;
}

const LikedPhotos = () => {
  const [likedPhotos, setLikedPhotos] = useState<Photo[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/users/${session.user.email}/liked-photos`)
        .then((response) => response.json())
        .then((data) => setLikedPhotos(data))
        .catch((error) => console.error("Error fetching liked photos", error));
    }
  }, [session]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Photos que vous avez likées</h2>
      {likedPhotos.length > 0 ? (
        likedPhotos.map((photo) => (
          <div key={photo.id} className="photo-card">
            <Image src={photo.url} alt={photo.title} width={100} height={100} />
            <p>{photo.title}</p>
          </div>
        ))
      ) : (
        <p>Aucune photo likée trouvée.</p>
      )}
    </div>
  );
};

export default LikedPhotos;
