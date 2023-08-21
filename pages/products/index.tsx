import SidebarLayout from "@/components/elements/SideBarLayout";
import Product from "@/components/fragments/products-page";
import { Raleway } from "next/font/google";
import { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";

const raleway = Raleway({ subsets: ["latin"] });

const Products: NextPageWithLayout = () => {
  return (
    <main className={`${raleway.className}`}>
      <Product />
    </main>
  );
};

Products.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default Products;
