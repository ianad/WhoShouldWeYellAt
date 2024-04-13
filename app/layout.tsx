import { GeistSans } from "geist/font/sans";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Who Should We Yell at?! 😠💢",
  description:
    "Find out which elected official you can complain to about your policy gripe",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground dark">
        <main className="w-screen h-screen min-h-screen mb-auto flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  );
}
