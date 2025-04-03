'use client'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Fee Predictor
        </Link>
        <WalletMultiButton className="!bg-primary !text-white" />
      </div>
    </nav>
  )
}