import SidebarLayout from "@/components/elements/SideBarLayout";
import { Raleway } from "next/font/google";
import { ReactElement } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import type { NextPageWithLayout } from "./_app";

const raleway = Raleway({ subsets: ["latin"] });

const Home: NextPageWithLayout = () => {
  return (
    <main className={`${raleway.className}`}>
      <h1>Dashboard</h1>
    </main>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  // TODO: add session auth component
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default Home;
