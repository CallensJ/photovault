"use client"; 

import './globals.css';
import Navbar from '@/app/components/Navbar';
import { ModalProvider } from '@/app/context/ModalContext';
import LoginForm from '@/app/components/modals/LoginForm';
import RegisterForm from '@/app/components/modals/RegisterForm';
import { SessionProvider } from 'next-auth/react'; // Ajout de l'import
import UploadImageForm from './components/modals/UploadImageForm';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>

        <SessionProvider>
          <ModalProvider>
            <Navbar />
            <LoginForm />
            <RegisterForm />
            <UploadImageForm />
            {children}
          </ModalProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
