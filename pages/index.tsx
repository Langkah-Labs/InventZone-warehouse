import Image from "next/image";
import { Inter } from "next/font/google";
import { SessionAuth } from "supertokens-auth-react/recipe/session";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <SessionAuth>
      <main className={`${inter.className}`}>
        <h1>Hello, NextJs</h1>
      </main>
    </SessionAuth>
  );
}
