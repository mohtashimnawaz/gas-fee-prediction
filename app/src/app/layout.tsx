import './/globals.css'
import { Providers } from './providers'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import ClientOnly from '@/components/ClientOnly'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
        <Providers>
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}