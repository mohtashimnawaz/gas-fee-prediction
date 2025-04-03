import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function WalletConnectPrompt() {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body items-center text-center">
        <h2 className="card-title">Connect Your Wallet</h2>
        <p>Please connect your Solana wallet to use the fee predictor</p>
        <div className="card-actions mt-4">
          <WalletMultiButton className="btn btn-primary" />
        </div>
      </div>
    </div>
  )
}