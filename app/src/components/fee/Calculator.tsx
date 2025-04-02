'use client'
import { useState } from 'react'
import { useProgram } from '@/hooks/useProgram'
import { useWallet } from '@solana/wallet-adapter-react'
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

  const handlePredict = async () => {
    if (!program || !publicKey) return
    
    try {
      const tx = await program.methods
        .predictFee(inputs.complexity, inputs.accounts, inputs.dataLength)
        .accounts({
          feePredictor: publicKey, // Replace with your PDA
          payer: publicKey,
        })
        .rpc()

      // Fetch and set prediction result
    } catch (error) {
      console.error("Prediction failed:", error)
    }
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Fee Prediction</h2>
        
        <div className="grid gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Complexity (1-10)</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={inputs.complexity}
              onChange={(e) => setInputs({...inputs, complexity: +e.target.value})}
              className="range range-primary"
            />
            <div className="flex justify-between px-2 text-xs">
              {[...Array(10)].map((_, i) => (
                <span key={i}>{i+1}</span>
              ))}
            </div>
          </div>

          {/* Other input fields */}

          <button 
            onClick={handlePredict}
            className="btn btn-primary"
            disabled={!publicKey}
          >
            Calculate Fee
          </button>
        </div>

        {prediction && <FeeResults {...prediction} />}
      </div>
    </div>
  )
}