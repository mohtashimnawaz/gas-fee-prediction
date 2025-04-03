import { format } from 'date-fns'

interface FeeResultsProps {
  fee: number
  timestamp: number
}

export default function FeeResults({ fee, timestamp }: FeeResultsProps) {
  return (
    <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Prediction Result</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Estimated Fee</p>
          <p className="text-2xl font-bold">{fee} lamports</p>
          <p className="text-sm">≈ {(fee / 1e9).toFixed(6)} SOL</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Predicted At</p>
          <p>{format(new Date(timestamp * 1000), 'PPpp')}</p>
        </div>
      </div>
    </div>
  )
}