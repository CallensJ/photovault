// /app/profile/[username]/page.tsx
"use client"; // Directive pour indiquer que c'est un Client Component

import { useParams } from "next/navigation"; // Pour récupérer les paramètres de l'URL

import Image from "next/image";
import { dummyUser } from "@/app/data/dummyUsers";

export default function Profile() {
  // Récupérer le paramètre `username` de l'URL
  const { username } = useParams();

  // Comparer si l'username dans l'URL correspond à celui de l'utilisateur
  if (`@${dummyUser.username}` !== username) {  // Ajouter le "@" ici
    return <p>Utilisateur non trouvé.</p>;
  }

  // Afficher le profil de l'utilisateur
  return (
    <div className="profile-container">
      {/* Profil utilisateur */}
      <div className="profile-header">
        <Image
          src={dummyUser.coverImage}
          alt="Cover Image"
          width={1200}
          height={400}
          className="cover-image"
        />
        <div className="avatar-container">
          <Image
            src={dummyUser.avatarUrl}
            alt="Avatar"
            width={150}
            height={150}
            className="avatar"
          />
        </div>
        <h1>{dummyUser.name}</h1>
        <p>@{dummyUser.username}</p>
        <p>{dummyUser.bio}</p>
      </div>

      {/* Galerie d'images */}
      <div className="image-gallery">
        {dummyUser.photos.map((photo) => (
          <div key={photo.id} className="photo-item">
            <Image
              src={photo.url}
              alt={photo.title}
              width={300}
              height={200}
              className="photo"
            />
            <h3>{photo.title}</h3>
            <p>{photo.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
