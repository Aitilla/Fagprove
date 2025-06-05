import type { Metadata } from "next";
import Header from "./components/Header/header";

export const metadata: Metadata = {
  title: "Fagprøve",
  description: "Fagprøve",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
