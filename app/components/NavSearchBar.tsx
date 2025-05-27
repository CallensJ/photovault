import { useState, useEffect } from 'react';

export default function NavSearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);

  useEffect(() => {
    // Remplacer par l'appel à l'api pour récupérer les catégories depuis la base de données.
    setCategories(['Nature', 'Art', 'Voyage', 'Animaux', 'Technologie', 'Sports']);
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredCategories([]);
    } else {
      const filtered = categories.filter((category) =>
        category.toLowerCase().startsWith(searchQuery.toLowerCase()) // Recherche par début du mot
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="relative flex items-center space-x-4">
      {/* Barre de recherche */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Rechercher par catégorie..."
        className="p-2 rounded border w-full sm:w-64 focus:ring-2 focus:ring-blue-500"
      />

      {/* Suggestions en-dessous de la recherche */}
      {searchQuery && filteredCategories.length > 0 && (
        <div className="absolute mt-1 w-full bg-white rounded-lg shadow-md z-10">
          <ul>
            {filteredCategories.map((category, index) => (
              <li
                key={index}
                className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer transition-all ease-in-out"
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Message d'absence de résultats */}
      {searchQuery && filteredCategories.length === 0 && (
        <p className="ml-4 text-red-500">Aucune catégorie trouvée.</p>
      )}
    </div>
  );
}
