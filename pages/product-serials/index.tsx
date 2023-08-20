import SidebarLayout from "@/components/elements/SideBarLayout";
import Product from "@/components/fragments/productSerials-page";
import { Raleway } from "next/font/google";
import { ReactElement } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import type { NextPageWithLayout } from "../_app";

const raleway = Raleway({ subsets: ["latin"] });

const Products: NextPageWithLayout = () => {
  return (
    <main className={`${raleway.className}`}>
      {/* TODO: change the content here */}
      <Product />
    </main>
  );
};

Products.getLayout = function getLayout(page: ReactElement) {
  // TODO: add session auth component
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default Products;
