'use client'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'
import { ReactNode, useMemo } from 'react'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  BackpackWalletAdapter
} from '@solana/wallet-adapter-wallets'

require('@solana/wallet-adapter-react-ui/styles.css')

export function Providers({ children }: { children: ReactNode }) {
  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => process.env.NEXT_PUBLIC_RPC_URL || clusterApiUrl(network), [network])

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new BackpackWalletAdapter()
    ],
    [network]
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}