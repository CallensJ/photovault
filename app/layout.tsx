import './globals.css'
import Navbar from '@/app/components/Navbar'
import { ModalProvider } from '@/app/context/ModalContext'
import LoginForm from '@/app/components/modals/LoginForm'
import RegisterForm from '@/app/components/modals/RegisterForm'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ModalProvider>
          <Navbar />
          <LoginForm />
          <RegisterForm />
          {children}
        </ModalProvider>
      </body>
    </html>
  )
}
