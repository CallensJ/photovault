'use client';

import { useParams } from 'next/navigation';
import { dummyUsers } from '@/app/data/dummyUsers';
import Image from 'next/image';

export default function ProfilePage() {
  const { username } = useParams();

  // On récupère l'utilisateur sans le "@" si l'URL est sans
  const user = dummyUsers.find((u) => u.username.replace('@', '') === username);

  if (!user) {
    return <div className="text-center mt-10 text-red-600">Utilisateur non trouvé.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-6 px-4">
      {/* Cover image */}
      <div className="w-full h-64 relative rounded-xl overflow-hidden mb-4">
        <Image
          src={user.coverImage}
          alt="Cover"
          fill
          className="object-cover"
        />
      </div>

      {/* Avatar + infos */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white -mt-16">
          <Image src={user.avatarUrl} alt={user.name} fill className="object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{user.name}</h1>
          <p className="text-gray-600">{user.username}</p>
          <p className="text-sm text-gray-500">{user.city}, {user.country}</p>
        </div>
      </div>

      {/* Bio */}
      <p className="mb-6 text-gray-700 italic">{user.bio}</p>

      {/* Galerie */}
      <h2 className="text-xl font-bold mb-4">Galerie</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {user.photos.map((photo) => (
          <div key={photo.id} className="relative w-full h-64 rounded-xl overflow-hidden shadow-md">
            <Image
              src={photo.url}
              alt={photo.title}
              fill
              className="object-cover"
            />
            {/* <div className="absolute bottom-0 bg-black bg-opacity-60 text-white text-sm p-2 w-full">
              <strong>{photo.title}</strong>
              <p className="text-xs">{photo.description}</p>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
}
