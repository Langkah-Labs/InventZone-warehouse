import Link from "next/link";
import SidebarLayout from "@/components/elements/SideBarLayout";
import Overview from "@/components/fragments/overview-page";
import { Raleway } from "next/font/google";
import { ReactElement } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import type { NextPageWithLayout } from "./_app";

const raleway = Raleway({ subsets: ["latin"] });

const Home: NextPageWithLayout = () => {
  return (
    <main className={`${raleway.className}`}>
      <Overview />
    </main>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  // TODO: add session auth component
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default Home;
