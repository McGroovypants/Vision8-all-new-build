import type { Metadata } from "next";
import "./homepage-v1.10.3.css";
import "./portfolio-pages.css";

const favicon =
  "https://res.cloudinary.com/deyb4o5qz/image/upload/v1785634833/new_vision8_logo_-_favicon_ofao6i.png";

export const metadata: Metadata = {
  // No version in the title: it goes stale and misleads. The on-page build
  // stamp is the authority.
  title: "Vision8",
  description:
    "Video, photography, audio, animation, real estate media, websites and AI solutions.",
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
