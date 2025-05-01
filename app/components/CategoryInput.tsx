// composant pour ajouter des categories aux photos

"use client";
import { useState } from "react";

export default function CategoryInput({
  onChange,
}: {
  onChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      const tag = input.trim().toLowerCase();
      if (!tags.includes(tag)) {
        const newTags = [...tags, tag];
        setTags(newTags);
        onChange(newTags);
        setInput("");
      }
    }
  };

  const removeTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    onChange(newTags);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Catégories</label>
      <div className="flex flex-wrap gap-2 p-2 border rounded">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="ml-1 text-red-500"
              type="button"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tape une catégorie et Entrée"
          className="flex-1 min-w-[120px] p-1 outline-none"
        />
      </div>
    </div>
  );
}
