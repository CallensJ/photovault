'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type ModalContextType = {
  showLogin: boolean
  showSignup: boolean
  openLogin: () => void
  openSignup: () => void
  closeModals: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  const openLogin = () => {
    setShowSignup(false)
    setShowLogin(true)
  }

  const openSignup = () => {
    setShowLogin(false)
    setShowSignup(true)
  }

  const closeModals = () => {
    setShowLogin(false)
    setShowSignup(false)
  }

  return (
    <ModalContext.Provider
      value={{ showLogin, showSignup, openLogin, openSignup, closeModals }}
    >
      {children}
    </ModalContext.Provider>
  )
}
