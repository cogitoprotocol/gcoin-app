import "@rainbow-me/rainbowkit/styles.css";
import classNames from "classnames";
import { Cousine, Rubik } from "next/font/google";
import { Footer } from "../components/Footer";
import Nav from "../components/nav/Nav";
import "./globals.css";
import Providers from "./providers";

const rubik = Rubik({ subsets: ["latin"] });
const cousine = Cousine({ subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "Cogito Protocol",
  description: "App for interacting with the Cogito Protocol",
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
              "flex flex-col items-center bg-white text-black dark:bg-dark dark:text-gray-100"
            )}
          >
            <main className="flex flex-col min-h-screen w-full sm:max-w-screen-xl sm:p-4 xl:p-8">
              <Nav />

              <div className="flex flex-col items-center p-4 sm:p-8">
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
