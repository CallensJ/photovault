// components/DeleteAccountButton.tsx
"use client";

export default function DeleteAccountButton() {
  function handleDeleteClick() {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
    );
    if (confirmDelete) {
      // TODO: envoyer une requête DELETE au backend
      console.log("Compte supprimé (simulation)");
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
