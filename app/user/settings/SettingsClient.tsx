"use client";

import { useState } from "react";
import AvatarSettings from "./components/AvatarSettings";
import UserInfoSettings from "./components/UserInfoSettings";
import { Session } from "next-auth";
import LikedPhotos from "./components/LikedPhotos";

const tabs = [
  "Profil",
  "Photos likées",
  "Utilisateurs suivis",
  "Mes Abonnements",
  "Utilisateurs Abonnes",
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SettingsClient({ session }: { session: Session }) {
  const [activeTab, setActiveTab] = useState("Profil");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6">
      <aside className="w-1/4 sticky top-24">
        <nav className="flex flex-col gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-4 py-2 rounded-lg ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </aside>

      <section className="flex-1 bg-[#393a3a] p-6 rounded-xl shadow-md">
        {activeTab === "Profil" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Profil</h2>
            <AvatarSettings />
            <UserInfoSettings />
          </div>
        )}
        {activeTab === "Photos likées" && <LikedPhotos />}
        {activeTab === "Utilisateurs suivis" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Utilisateurs que vous suivez</h2>
            <p>[Liste des utilisateurs suivis]</p>
          </div>
        )}
        {activeTab === "Mes Abonnements" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Utilisateurs à qui je suis abonné</h2>
            <p>[Liste des utilisateurs à qui jai souscrit]</p>
          </div>
        )}
        {activeTab === "Utilisateurs Abonnes" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Utilisateurs abonnés à moi</h2>
            <p>[Liste des utilisateurs abonnés à moi]</p>
          </div>
        )}
      </section>
    </div>
  );
}
