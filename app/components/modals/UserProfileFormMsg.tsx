"use client";

export default function UserProfileFormMsg() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Envoyer un message</h3>
      <form>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
          placeholder="Votre message..."
          rows={4}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}
