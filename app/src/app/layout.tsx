import "./globals.css";
import { SolanaProvider } from "@/components/WalletProvider";

export const metadata = {
  title: "Solana Fee Predictor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SolanaProvider>
          <main className="container">{children}</main>
        </SolanaProvider>
      </body>
    </html>
  );
}
