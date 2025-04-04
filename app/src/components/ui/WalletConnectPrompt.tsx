// src/components/ui/WalletConnectPrompt.tsx
'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import ClientOnly from '@/components/ClientOnly'; // Adjust path

export default function WalletConnectPrompt() {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Wallet Required</h2>
        <p>Please connect your Solana wallet to use the fee predictor</p>
        <div className="card-actions mt-4">
          <ClientOnly>
            <WalletMultiButton className="btn btn-primary" />
          </ClientOnly>
        </div>
      </div>
    </div>
  );
}