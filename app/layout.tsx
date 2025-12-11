import type { ReactNode } from "react";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/footer";

export const metadata = {
  title: "Bookshelf",
  description: "Simple reading tracker",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="site-body">
        <NavBar />
        <main className="site-main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
