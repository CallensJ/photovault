// app/user/settings/page.tsx
'use client';

import { useState } from 'react';

const tabs = ['Profil', 'Photos likées', 'Utilisateurs suivis'];

export default function UserSettings() {
  const [activeTab, setActiveTab] = useState('Profil');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6">
      {/* Sidebar */}
      <aside className="w-1/4">
        <nav className="flex flex-col gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-4 py-2 rounded-lg ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <section className="flex-1 bg-white p-6 rounded-xl shadow-md">
        {activeTab === 'Profil' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Modifier votre profil</h2>
            {/* Ici tu pourrais importer <AvatarSettings /> et <InfoSettings /> */}
            <p>[Formulaire de modification d’avatar et d’infos]</p>
          </div>
        )}
        {activeTab === 'Photos likées' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Photos que vous avez aimées</h2>
            <p>[Galerie des photos likées]</p>
          </div>
        )}
        {activeTab === 'Utilisateurs suivis' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Utilisateurs que vous suivez</h2>
            <p>[Liste des utilisateurs suivis]</p>
          </div>
        )}
      </section>
    </div>
  );
}
