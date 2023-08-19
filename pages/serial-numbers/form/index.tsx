import SidebarLayout from "@/components/elements/SideBarLayout";
import SerialNumbersForm from "@/components/fragments/serialNumber-page/Form";
import { Raleway } from "next/font/google";
import { ReactElement } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import type { NextPageWithLayout } from "../../_app";

const raleway = Raleway({ subsets: ["latin"] });

const serialNumbers = [
  {
    name: "Dummy 1",
    productOrderNumber: "123001",
    quantity: "11",
  },
  // More people...
];

const SerialNumbers: NextPageWithLayout = () => {
  return (
    <main className={`${raleway.className}`}>
      <SerialNumbersForm />
    </main>
  );
};

SerialNumbers.getLayout = function getLayout(page: ReactElement) {
  // TODO: add session auth component
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default SerialNumbers;
