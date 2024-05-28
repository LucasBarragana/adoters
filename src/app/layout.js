import { AppProvider } from "./components/AppContext";
import { Roboto } from 'next/font/google'
import './globals.css'
import { Toaster } from "react-hot-toast";

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={roboto.className}>
          <main className="max-w-5xl mx-auto p-4">
            <AppProvider>
              <Toaster />
              {children}
            </AppProvider>
          </main>
      </body>
    </html>
  )
}