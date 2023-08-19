import SidebarLayout from "@/components/SidebarLayout";
import { Raleway } from "next/font/google";
import { ReactElement } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import type { NextPageWithLayout } from "./_app";

const raleway = Raleway({ subsets: ["latin"] });

const Products: NextPageWithLayout = () => {
  return (
    <main className={`${raleway.className}`}>
      {/* TODO: change the content here */}
      <h1>Products</h1>
    </main>
  );
};

Products.getLayout = function getLayout(page: ReactElement) {
  // TODO: add session auth component
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default Products;
