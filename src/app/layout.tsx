import "@rainbow-me/rainbowkit/styles.css";
import classNames from "classnames";
import { Footer } from "components/nav/Footer";
import Nav from "components/nav/Nav";
import { Rubik } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata = {
  title: "Cogito Protocol",
  description: "App for interacting with the Cogito Protocol",
  icons: {
    other: [
      {
        rel: "icon",
        url: "/img/icon-light.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        rel: "icon",
        url: "/img/icon-dark.svg",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <script src="/noflash.js" />
        <Providers>
          <div
            className={classNames(
              rubik.className,
              "flex flex-col items-center bg-light-pattern text-black dark:bg-dark-pattern  dark:text-gray-100"
            )}
          >
            <main className="flex flex-col min-h-screen w-full md:max-w-screen-xl md:p-4 xl:p-8">
              <Nav />

              <div className="flex flex-col items-center p-4 md:p-8">
                {children}
              </div>
            </main>

            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
