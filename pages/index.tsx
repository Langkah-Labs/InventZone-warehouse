import { Raleway } from "next/font/google";
import { SessionAuth } from "supertokens-auth-react/recipe/session";

const raleway = Raleway({ subsets: ["latin"] });

export default function Home() {
  return (
    <SessionAuth>
      <main className={`${raleway.className}`}>
        <h1>Hello, NextJs</h1>
      </main>
    </SessionAuth>
  );
}
