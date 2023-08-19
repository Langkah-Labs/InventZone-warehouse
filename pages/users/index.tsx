import SidebarLayout from "@/components/SidebarLayout";
import { Raleway } from "next/font/google";
import { ReactElement } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import type { NextPageWithLayout } from "./../_app";

const raleway = Raleway({ subsets: ["latin"] });

const Index: NextPageWithLayout = () => {
  return (
    <main className={`${raleway.className}`}>
      {/* TODO: change the content here */}
      <h1>Users</h1>
    </main>
  );
};

Index.getLayout = function getLayout(page: ReactElement) {
  // TODO: add session auth component
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default Index;
