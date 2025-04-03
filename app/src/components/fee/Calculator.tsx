'use client'
import { useState } from 'react'
import { useProgram } from '@/hooks/useProgram'
import { useWallet } from '@solana/wallet-adapter-react'
import FeeResults from './Results'
import { toast } from 'react-hot-toast'

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

  const handlePredict = async () => {
    if (!program || !publicKey) return
    
    setLoading(true)
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
      
      toast.success('Fee predicted successfully!')
    } catch (error: any) {
      toast.error(`Prediction failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Fee Calculator</h2>
        
        <div className="grid gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Operation Complexity (1-10)</span>
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

          <div className="form-control">
            <label className="label">
              <span className="label-text">Additional Accounts</span>
            </label>
            <input
              type="number"
              min="1"
              value={inputs.accounts}
              onChange={(e) => setInputs({...inputs, accounts: +e.target.value})}
              className="input input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Data Length (bytes)</span>
            </label>
            <input
              type="number"
              min="1"
              value={inputs.dataLength}
              onChange={(e) => setInputs({...inputs, dataLength: +e.target.value})}
              className="input input-bordered"
            />
          </div>

          <button 
            onClick={handlePredict}
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
            disabled={!publicKey || loading}
          >
            {loading ? 'Processing' : 'Predict Fee'}
          </button>
        </div>

        {prediction && <FeeResults {...prediction} />}
      </div>
    </div>
  )
}