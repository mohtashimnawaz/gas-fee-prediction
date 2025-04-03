'use client'
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { Program, Provider } from '@coral-xyz/anchor'
import { IDL } from '@/types/anchor'
import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'

export function useProgram() {
  const { connection } = useConnection()
  const wallet = useAnchorWallet()

  const programId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID!)

  const program = useMemo(() => {
    if (!wallet) return null
    
    const provider = new Provider(connection, wallet, {
      preflightCommitment: 'confirmed'
    })

    return new Program(IDL, programId, provider)
  }, [connection, wallet])

  return { program }
}