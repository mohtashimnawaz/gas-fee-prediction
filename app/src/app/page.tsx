'use client'
import FeeCalculator from '@/components/fee/Calculator'
import { useWallet } from '@solana/wallet-adapter-react'
import WalletConnectPrompt from '@/components/ui/WalletConnectPrompt'

export default function Home() {
  const { publicKey } = useWallet()

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Solana Fee Predictor
      </h1>
      {publicKey ? <FeeCalculator /> : <WalletConnectPrompt />}
    </div>
  )
}