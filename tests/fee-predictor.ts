import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { FeePredictor } from '../target/types/fee_predictor';
import { expect } from 'chai';

describe('fee-predictor', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.FeePredictor as Program<FeePredictor>;
  const admin = provider.wallet;
  let feePredictorPDA: anchor.web3.PublicKey;

  before(async () => {
    [feePredictorPDA] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("fee_predictor")],
      program.programId
    );
  });

  // Helper function to get error message from transaction
  async function expectError(fn: () => Promise<any>, expectedError: string) {
    try {
      await fn();
      expect.fail("Expected transaction to fail");
    } catch (err) {
      if (err instanceof Error && err.message.includes(expectedError)) {
        return; // Success
      }
      if (err.logs && err.logs.some(log => log.includes(expectedError))) {
        return; // Success
      }
      throw new Error(`Expected error "${expectedError}" but got: ${err}`);
    }
  }

  it('Initializes the fee predictor', async () => {
    const baseFee = new anchor.BN(5000);
    await program.methods.initialize(baseFee)
      .accounts({
        feePredictor: feePredictorPDA,
        payer: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const account = await program.account.feePredictor.fetch(feePredictorPDA);
    expect(account.baseFee.toString()).to.equal(baseFee.toString());
    expect(account.version).to.equal(1);
  });

  it('Fails to initialize with too low fee', async () => {
    const [testPDA] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("test_fee_predictor")],
      program.programId
    );

    await expectError(
      () => program.methods.initialize(999)
        .accounts({
          feePredictor: testPDA,
          payer: admin.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc(),
      "Base fee must be at least 1000 lamports"
    );
  });

  it('Predicts a fee', async () => {
    const [feePredictionPDA] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("fee_prediction"), admin.publicKey.toBuffer()],
      program.programId
    );

    await program.methods.predictFee(3, 5, 128)
      .accounts({
        feePredictor: feePredictorPDA,
        feePrediction: feePredictionPDA,
        payer: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const prediction = await program.account.feePrediction.fetch(feePredictionPDA);
    expect(prediction.estimatedFee.toString()).to.equal("11120");
  });

  it('Fails with invalid complexity', async () => {
    const [feePredictionPDA] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("invalid_complexity"), admin.publicKey.toBuffer()],
      program.programId
    );

    await expectError(
      () => program.methods.predictFee(11, 1, 10)
        .accounts({
          feePredictor: feePredictorPDA,
          feePrediction: feePredictionPDA,
          payer: admin.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc(),
      "Operation complexity must be between 1 and 10"
    );
  });

  it('Updates base fee as admin', async () => {
    const newBaseFee = new anchor.BN(6000);
    await program.methods.updateBaseFee(newBaseFee)
      .accounts({
        feePredictor: feePredictorPDA,
        admin: admin.publicKey,
      })
      .rpc();

    const account = await program.account.feePredictor.fetch(feePredictorPDA);
    expect(account.baseFee.toString()).to.equal(newBaseFee.toString());
  });

  it('Fails to update base fee as non-admin', async () => {
    const hacker = anchor.web3.Keypair.generate();
    
    await expectError(
      () => program.methods.updateBaseFee(new anchor.BN(9999))
        .accounts({
          feePredictor: feePredictorPDA,
          admin: hacker.publicKey,
        })
        .signers([hacker])
        .rpc(),
      "Unauthorized: only admin can update base fee"
    );
  });
});