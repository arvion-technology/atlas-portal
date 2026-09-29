import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Atlas Portal | Northwind Labs",
  description:
    "A customer portal for invoices, support tickets and account settings. Built with Next.js 15 App Router and React Server Components.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="theme-paper">
      <body>
        <SiteHeader />
        <main className="shell">{children}</main>
        <footer className="site-footer">
          <span>Atlas Portal, a reference implementation by Arvion Technologies.</span>
          <span className="footer-links">
            <a href="https://arviontech.net">arviontech.net</a>
            <span aria-hidden="true">/</span>
            <a href="https://github.com/arvion-technology/atlas-portal">source</a>
          </span>
        </footer>
      </body>
    </html>
  );
}
