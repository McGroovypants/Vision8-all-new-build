import type { Metadata } from "next";
import "./homepage-v1.10.3.css";

const favicon =
  "https://res.cloudinary.com/deyb4o5qz/image/upload/v1785634833/new_vision8_logo_-_favicon_ofao6i.png";

export const metadata: Metadata = {
  // No version in the title: it goes stale and misleads. The on-page build
  // stamp is the authority.
  title: "Vision8 homepage",
  description:
    "A private local review of the fanned Vision8 homepage direction.",
  icons: {
    icon: favicon,
    shortcut: favicon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
