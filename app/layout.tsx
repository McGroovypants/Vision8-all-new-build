import type { Metadata, Viewport } from "next";
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

/*
  v1.11.67: `viewport-fit=cover` lets the page reach under a phone's rounded
  corners and notch, which is what makes a landscape hero fill the screen
  rather than sit in a letterbox between two black bars. It only works paired
  with the safe-area padding in the stylesheet: without that the notch would
  crop the header's own content in landscape.

  Next writes width=device-width and initial-scale=1 by default; both are
  restated here because declaring the export replaces the default outright.
*/
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
