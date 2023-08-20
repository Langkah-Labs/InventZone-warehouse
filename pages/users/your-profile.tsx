import SidebarLayout from "@/components/elements/SideBarLayout";
import Link from "next/link";
import { Raleway } from "next/font/google";
import { ReactElement } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import type { NextPageWithLayout } from "../_app";
import InputField from "@/components/elements/Form/InputField";

const raleway = Raleway({ subsets: ["latin"] });

const Products: NextPageWithLayout = () => {
  return (
    <main className={`${raleway.className}`}>
      {/* TODO: change the content here */}
      <div className="flex flex-col items-center gap-3">
        <div>{/* Avatar */}</div>
        <div className="text-center">
          <h2 className="body-4large-bold text-[#113A5D]">Tom Cook</h2>
          <h5 className="text-gray-600">Operation</h5>
          <h5 className="text-gray-400">Admin</h5>
        </div>
        <div>
          <form>
            <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
              <InputField
                id="first-name"
                name="first-name"
                label="First Name"
              />

              <InputField id="last-name" name="last-name" label="Last Name" />

              <InputField id="email" name="email" label="Email" />

              <InputField id="password" name="password" label="New Password" />

              <InputField
                id="password"
                name="password"
                label="Confirm Password"
              />
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Link
                href="/"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md bg-[#113A5D] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

Products.getLayout = function getLayout(page: ReactElement) {
  // TODO: add session auth component
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default Products;
