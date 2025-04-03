'use client'
import { useState } from 'react'
import { useProgram } from '@/hooks/useProgram'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import FeeResults from './Results'

export default function FeeCalculator() {
  const { program } = useProgram()
  const { publicKey } = useWallet()
  const [inputs, setInputs] = useState({
    complexity: 3,
    accounts: 2,
    dataLength: 128
  })
  const [prediction, setPrediction] = useState<{
    fee: number
    timestamp: number
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{text: string, isError: boolean} | null>(null)

  const handlePredict = async () => {
    if (!program || !publicKey) return
    
    setLoading(true)
    setMessage(null)
    try {
      const [feePredictorPDA] = await PublicKey.findProgramAddressSync(
        [Buffer.from("fee_predictor")],
        program.programId
      )

      const [predictionPDA] = await PublicKey.findProgramAddressSync(
        [Buffer.from("fee_prediction"), publicKey.toBuffer()],
        program.programId
      )

      const tx = await program.methods
        .predictFee(inputs.complexity, inputs.accounts, inputs.dataLength)
        .accounts({
          feePredictor: feePredictorPDA,
          feePrediction: predictionPDA,
          payer: publicKey,
        })
        .rpc()

      const result = await program.account.feePrediction.fetch(predictionPDA)
      setPrediction({
        fee: result.estimatedFee.toNumber(),
        timestamp: result.timestamp.toNumber()
      })
      setMessage({ text: 'Fee predicted successfully!', isError: false })
    } catch (error: any) {
      setMessage({ text: `Prediction failed: ${error.message}`, isError: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Fee Calculator</h2>
        
        {message && (
          <div className={`alert ${message.isError ? 'alert-error' : 'alert-success'}`}>
            {message.text}
          </div>
        )}

        {/* Rest of the component remains the same */}
        <div className="grid gap-6">
          {/* ... existing form inputs ... */}
        </div>

        {prediction && <FeeResults {...prediction} />}
      </div>
    </div>
  )
}