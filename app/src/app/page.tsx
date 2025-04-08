import FeePredictorForm from "@/components/FeePredictorForm";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Solana Fee Predictor</h1>
      <FeePredictorForm />
    </div>
  );
}
