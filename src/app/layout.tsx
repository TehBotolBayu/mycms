import type { Metadata } from "next";
import "./globals.css";
import {AuthProvider} from './Providers';
import {Navbar} from '@/components'
import Tes from './tes'


export const metadata: Metadata = {
  title: "mycms",
  description: "content management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet" />
      </head>
      <body className="font-serif">
        {/* <div className="bg-red-300 max-w-screen-xl min-w-[50vw] h-screen"></div> */}
        <AuthProvider>
          {/* <Tes /> */}
          <Navbar/>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
