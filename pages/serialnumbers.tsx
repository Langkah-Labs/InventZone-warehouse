import SidebarLayout from "@/components/SidebarLayout";
import { Raleway } from "next/font/google";
import { ReactElement } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import type { NextPageWithLayout } from "./_app";

const raleway = Raleway({ subsets: ["latin"] });

const SerialNumber: NextPageWithLayout = () => {
  return (
    <main className={`${raleway.className}`}>
      {/* TODO: change the content here */}
      <h1>Serial Number</h1>
    </main>
  );
};

SerialNumber.getLayout = function getLayout(page: ReactElement) {
  // TODO: add session auth component
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default SerialNumber;