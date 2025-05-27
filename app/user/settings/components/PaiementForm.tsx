'use client'

import { useState } from 'react';
import React from 'react';

export default function PaiementForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Moyen de paiement enregistré :', formData);
  
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Ajouter un moyen de paiement</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nom complet</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 bg-[#1c2027] border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 bg-[#1c2027] border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Numéro de carte</label>
          <input
            type="text"
            name="cardNumber"
            required
            placeholder="4242 4242 4242 4242"
            value={formData.cardNumber}
            onChange={handleChange}
            className="w-full p-2 bg-[#1c2027] border rounded"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">Expiration</label>
            <input
              type="text"
              name="expiry"
              required
              placeholder="MM/YY"
              value={formData.expiry}
              onChange={handleChange}
              className="w-full p-2 bg-[#1c2027] border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">CVC</label>
            <input
              type="text"
              name="cvc"
              required
              placeholder="123"
              value={formData.cvc}
              onChange={handleChange}
              className="w-full p-2 bg-[#1c2027] border rounded"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-gray-300 text-white cursor-pointer py-2 rounded  bg-gradient-to-r from-[#f9572a] to-[#ff9b05] hover:opacity-90"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
