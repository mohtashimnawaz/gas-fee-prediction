"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

export default function FeePredictorForm() {
  const { publicKey, connected } = useWallet();
  const [complexity, setComplexity] = useState(1);
  const [accounts, setAccounts] = useState(1);
  const [dataLength, setDataLength] = useState(10);
  const [fee, setFee] = useState<number | null>(null);

  const predictFee = async () => {
    if (!connected || !publicKey) return alert("Connect wallet");

    // Call backend / program interaction
    const estimatedFee = 5000 + complexity ** 2 * 50 + accounts * 750 + dataLength * 15;

    setFee(estimatedFee);
  };

  return (
    <div>
      <div className="mb-4">
        <label>Complexity</label>
        <input
          type="number"
          min="1"
          max="10"
          value={complexity}
          onChange={(e) => setComplexity(Number(e.target.value))}
          className="block w-full p-2 bg-zinc-800"
        />
      </div>

      <div className="mb-4">
        <label>Additional Accounts</label>
        <input
          type="number"
          min="1"
          max="20"
          value={accounts}
          onChange={(e) => setAccounts(Number(e.target.value))}
          className="block w-full p-2 bg-zinc-800"
        />
      </div>

      <div className="mb-4">
        <label>Data Length</label>
        <input
          type="number"
          min="0"
          max="1024"
          value={dataLength}
          onChange={(e) => setDataLength(Number(e.target.value))}
          className="block w-full p-2 bg-zinc-800"
        />
      </div>

      <button onClick={predictFee} className="btn">
        Predict Fee
      </button>

      {fee && <p className="mt-4 text-lg">Estimated Fee: {fee} lamports</p>}
    </div>
  );
}
