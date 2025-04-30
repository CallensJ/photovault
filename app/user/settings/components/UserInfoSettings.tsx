import { useState } from "react";
import DeleteAccountButton from "./DeleteAccountButton";

type FormData = {
  username: string;
  email: string;
  age: string;
  bio: string;
  city: string;
  country: string;
  gender: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function UserInfoSettings() {
    const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    age: "",
    bio: "",
    password: "",
    confirmPassword: "",
    city: "",
    country: "",
    gender: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const newErrors: FormErrors = {};

    if (!formData.email.includes("@"))
      newErrors.email = "Adresse email invalide";
    if (
      formData.age &&
      (isNaN(Number(formData.age)) ||
        Number(formData.age) <= 0 ||
        Number(formData.age) > 120)
    ) {
      newErrors.age = "Âge invalide";
    }
    if (formData.bio.length > 250)
      newErrors.bio = "La bio est trop longue (max 250 caractères)";
    if (formData.password && formData.password.length < 6)
      newErrors.password = "Mot de passe trop court (min 6 caractères)";
    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }

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
          className={`mt-1 w-full px-4 py-2 rounded-lg bg-[#1c2027] border ${
            errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1 animate-fade-in">
            {errors.email}
          </p>
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
          className={`mt-1 w-full px-4 py-2 rounded-lg bg-[#1c2027] border ${
            errors.age ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
        />
        {errors.age && (
          <p className="text-sm text-red-600 mt-1 animate-fade-in">
            {errors.age}
          </p>
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
          className={`mt-1 w-full px-4 py-2 rounded-lg bg-[#1c2027] border ${
            errors.bio ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
          rows={4}
        />
        {errors.bio && (
          <p className="text-sm text-red-600 mt-1 animate-fade-in">
            {errors.bio}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="relative">
  <label htmlFor="password" className="block font-medium">Mot de passe</label>
  <input
    id="password"
    name="password"
    value={formData.password}
    onChange={handleChange}
    type={showPassword ? "text" : "password"}
    className={`mt-1 w-full px-4 py-2 rounded-lg bg-[#1c2027] border ${
      errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
    }`}
  />
    <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute right-3 top-9 text-sm text-gray-600"
  >
    {showPassword ? "Masquer" : "Afficher"}
  </button>
  {errors.password && (
    <p className="text-sm text-red-600 mt-1">{errors.password}</p>
  )}
</div>

      {/* Confirm Password */}
      <div className="relative">
  <label htmlFor="confirmPassword" className="block font-medium">Confirmer le mot de passe</label>
  <input
    id="confirmPassword"
    name="confirmPassword"
    value={formData.confirmPassword}
    onChange={handleChange}
    type={showConfirmPassword ? "text" : "password"}
    className={`mt-1 w-full px-4 py-2 rounded-lg bg-[#1c2027] border ${
      errors.confirmPassword ? "border-red-500 bg-red-50" : "border-gray-300"
    }`}
  />
  <button
    type="button"
    onClick={() => setShowConfirmPassword((prev) => !prev)}
    className="absolute right-3 top-9 text-sm text-gray-600"
  >
    {showConfirmPassword ? "Masquer" : "Afficher"}
  </button>
  {errors.confirmPassword && (
    <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
  )}
</div>

      <button
        type="submit"
        className=" cursor-pointer mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Sauvegarder
      </button>
  <DeleteAccountButton />
    </form>
  );
}
