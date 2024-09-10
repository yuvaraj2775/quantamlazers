import { Inter } from "next/font/google";
import "./globals.css";
import Dashboard from "./Dashboard/page";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex">
    <div className="w-1/5">
    <Dashboard/>
    </div>
    <main className="w-4/5">{children}</main>
   
    </body>
    
     
    </html>
  );
}
