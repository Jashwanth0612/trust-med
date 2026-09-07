import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TRUST-MED",
  description: "Healthcare AI Trust & Knowledge Fabric",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
