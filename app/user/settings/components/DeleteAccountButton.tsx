// components/DeleteAccountButton.tsx
"use client";

export default function DeleteAccountButton() {
  async function handleDeleteClick() {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
    );
  
    if (!confirmDelete) return;
  
    try {
      const res = await fetch("/api/delete-account", {
        method: "DELETE",
      });
  
      if (res.ok) {
        // Déconnecter l'utilisateur après suppression
        window.location.href = "/api/auth/signout";
      } else {
        alert("Erreur lors de la suppression du compte.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur réseau ou serveur.");
    }
  }
  

  return (
    <div>

    <button
      onClick={handleDeleteClick}
      className="cursor-pointer mt-8 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Supprimer mon compte
    </button>
    </div>
  );
}
