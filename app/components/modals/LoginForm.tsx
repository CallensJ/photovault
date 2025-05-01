'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useModal } from '@/app/context/ModalContext'

export default function LoginForm() {
  const { showLogin, closeModals } = useModal()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  if (!showLogin) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (res?.error) {
      setError(res.error)
    } else {
      closeModals()
      router.refresh()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#393a3a] p-6 rounded-lg w-full sm:w-96 relative">
        <h2 className="text-xl font-semibold mb-4">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
  <div className="flex flex-col">
    <label htmlFor="email" className="mb-1 text-sm font-medium text-white">
      Email
    </label>
    <input
      id="email"
      type="email"
      required
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="bg-[#1c2027] border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div className="flex flex-col">
    <label htmlFor="password" className="mb-1 text-sm font-medium text-white">
      Password
    </label>
    <input
      id="password"
      type="password"
      required
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="bg-[#1c2027] border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {error && <div className="text-red-500 text-sm">{error}</div>}

  <button
    type="submit"
    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
  >
    Login
  </button>
</form>


        <button onClick={closeModals} className="absolute top-2 right-2">×</button>
      </div>
    </div>
  )
}
