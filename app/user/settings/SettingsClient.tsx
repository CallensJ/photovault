// gere  le tableau options de la page settings

"use client";

import { useState } from "react";
import AvatarSettings from "./components/AvatarSettings";
import UserInfoSettings from "./components/UserInfoSettings";
import { Session } from "next-auth";
import LikedPhotos from "./components/LikedPhotos";
import PaiementForm from "./components/PaiementForm";

const tabs = [
  "Profil",
  "Photos likées",
  "Utilisateurs suivis",
  "Mes Abonnements",
  "Utilisateurs Abonnes",
  "Moyen de paiement",
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
              className={`text-left cursor-pointer px-4 py-2 rounded-lg font-bold text-white no-underline ${
                activeTab === tab ? "" : "opacity-80 hover:opacity-100"
              }`}
              style={{
                background:
                  activeTab === tab
                    ? "linear-gradient(90deg, #f9572a, #ff9b05)"
                    : "#f3f4f6", // fallback gray
                color: activeTab === tab ? "#ffffff" : "#1f2937", // white or gray-800
              }}
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
        {/* section photos likees */}
        {activeTab === "Photos likées" && <LikedPhotos />}

        {/* section utilisateurs suivis */}
        {activeTab === "Utilisateurs suivis" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Utilisateurs que vous suivez
            </h2>
            <p>[Liste des utilisateurs suivis]</p>
          </div>
        )}

        {activeTab === "Mes Abonnements" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Utilisateurs à qui je suis abonné
            </h2>
            <p>[Liste des utilisateurs à qui jai souscrit]</p>
          </div>
        )}
        {activeTab === "Utilisateurs Abonnes" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Utilisateurs abonnés à moi
            </h2>
            <p>[Liste des utilisateurs abonnés à moi]</p>
          </div>
        )}
        {activeTab === "Moyen de paiement" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              mes moyens de paiement
            </h2>
            <PaiementForm />
          </div>
        )}
      </section>
    </div>
  );
}
