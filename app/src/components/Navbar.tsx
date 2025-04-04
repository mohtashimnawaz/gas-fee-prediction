'use client'
import Link from 'next/link'
import ClientOnly from './ClientOnly'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Fee Predictor
        </Link>
        <ClientOnly>
          <WalletMultiButton className="!bg-primary !text-white" />
        </ClientOnly>
      </div>
    </nav>
  )
}