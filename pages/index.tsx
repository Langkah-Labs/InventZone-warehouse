import Link from "next/link";
import SidebarLayout from "@/components/SidebarLayout";
import { Raleway } from "next/font/google";
import { ReactElement } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import type { NextPageWithLayout } from "./_app";

const raleway = Raleway({ subsets: ["latin"] });

const Home: NextPageWithLayout = () => {
  return (
    <main className={`${raleway.className}`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex-grow sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Hello, Admin!
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              View report Product on current progress.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Search for users"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full mt-8 gap-8 items-center border-2 border-[#ECEEF6] rounded-[16px] p-8">
          <h1 className="text-[24px] text-[#113A5D] text-center font-semibold">
            Start creating data
          </h1>

          <div className="w-full flex items-center gap-5">
            <Link
              href="#"
              className="flex w-full justify-center items-center border-2 border-[#ECEEF6] rounded-[16px] p-8"
            >
              Create new Product
            </Link>

            <Link
              href="#"
              className="flex w-full justify-center items-center border-2 border-[#ECEEF6] rounded-[16px] p-8"
            >
              Create new Serial Number
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  // TODO: add session auth component
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default Home;
