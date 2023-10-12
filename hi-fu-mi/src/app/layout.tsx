import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SocketProvider } from "./utils/socketContext";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Hi-Fu-Mi: Pierre, Papier, Ciseaux en ligne",
    description:
        "Entrez dans l'arène numérique du jeu intemporel Pierre, Papier, Ciseaux! Défiez vos amis en ligne ou tentez votre chance contre des joueurs au hasard. Prêt à jouer à Hi-Fu-Mi?",
    keywords: "Pierre Papier Ciseaux, Jeu en Ligne, Hi-Fu-Mi, Multijoueur",
    authors: { url: "https://github.com/HollyTotoC", name: "Théo-toto Certa" },
    robots: "index, follow",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            <head>
                <Script id="gtm-inline-script" strategy="lazyOnload">
                    {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','GTM-K2VTKMVP');`}
                </Script>
            </head>
            <body className={inter.className}>
                {/* Google Tag Manager (noscript) */}
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-K2VTKMVP"
                        height="0"
                        width="0"
                        style={{ display: "none", visibility: "hidden" }}
                    />
                </noscript>
                {/* End Google Tag Manager (noscript) */}

                <SocketProvider>{children}</SocketProvider>
            </body>
        </html>
    );
}
