import { useState } from "react";

type FormData = {
  username: string;
  email: string;
  age: string;
  bio: string;
  city: string;
  country: string;
  gender: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function UserInfoSettings() {
  const [formData, setFormData] = useState<FormData>({
    username: "lara",
    email: "",
    age: "",
    bio: "",
    city: "",
    country: "",
    gender: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const newErrors: FormErrors = {};

    if (!formData.email.includes("@")) newErrors.email = "Adresse email invalide";
    if (
      formData.age &&
      (isNaN(Number(formData.age)) || Number(formData.age) <= 0 || Number(formData.age) > 120)
    ) {
      newErrors.age = "Âge invalide";
    }
    if (formData.bio.length > 250) newErrors.bio = "La bio est trop longue (max 250 caractères)";
    if (formData.password && formData.password.length < 6)
      newErrors.password = "Mot de passe trop court (min 6 caractères)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    alert("Données valides !");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
  {/* Email */}
  <div>
    <label htmlFor="email" className="block font-medium">
      Email
    </label>
    <input
      id="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      type="email"
      className={`mt-1 w-full px-4 py-2 rounded-lg border ${
        errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
      }`}
    />
    {errors.email && (
      <p className="text-sm text-red-600 mt-1 animate-fade-in">{errors.email}</p>
    )}
  </div>

  {/* Age */}
  <div>
    <label htmlFor="age" className="block font-medium">
      Âge
    </label>
    <input
      id="age"
      name="age"
      value={formData.age}
      onChange={handleChange}
      type="text"
      className={`mt-1 w-full px-4 py-2 rounded-lg border ${
        errors.age ? "border-red-500 bg-red-50" : "border-gray-300"
      }`}
    />
    {errors.age && (
      <p className="text-sm text-red-600 mt-1 animate-fade-in">{errors.age}</p>
    )}
  </div>

  {/* Bio */}
  <div>
    <label htmlFor="bio" className="block font-medium">
      Bio
    </label>
    <textarea
      id="bio"
      name="bio"
      value={formData.bio}
      onChange={handleChange}
      className={`mt-1 w-full px-4 py-2 rounded-lg border ${
        errors.bio ? "border-red-500 bg-red-50" : "border-gray-300"
      }`}
      rows={4}
    />
    {errors.bio && (
      <p className="text-sm text-red-600 mt-1 animate-fade-in">{errors.bio}</p>
    )}
  </div>

  {/* Password */}
  <div>
    <label htmlFor="password" className="block font-medium">
      Mot de passe
    </label>
    <input
      id="password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      type="password"
      className={`mt-1 w-full px-4 py-2 rounded-lg border ${
        errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
      }`}
    />
    {errors.password && (
      <p className="text-sm text-red-600 mt-1 animate-fade-in">{errors.password}</p>
    )}
  </div>

  <button
    type="submit"
    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
  >
    Sauvegarder
  </button>
</form>

  );
}
