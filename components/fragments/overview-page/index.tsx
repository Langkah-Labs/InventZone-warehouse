import React from "react";
import Link from "next/link";
import DropdownList from "@/components/elements/Form/DropdownList";
import LineAreaChart from "@/components/fragments/overview-page/LineAreaChart";

export default function index() {
  const period = [
    { value: 0, label: "Choose One" },
    { value: 1, label: "Last 1 Months" },
    { value: 2, label: "Last 7 Days" },
    { value: 3, label: "Last 3 Days" },
    { value: 4, label: "Last Week" },
    { value: 5, label: "This Week" },
  ];
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex-grow sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="body-4large-bold font-semibold leading-6 text-[#113A5D]">
            Hello, Tom!
          </h1>
          <p className="mt-4 body-base-regular text-gray-400">
            View your current product progress.
          </p>
        </div>
      </div>

      <div className="mt-8 p-8 border border-[#ECEEF6] rounded-[16px]">
        <div className="flex justify-between">
          <h2 className="text-[#113A5D] text-left body-2large-bold">
            Activity
          </h2>
          <DropdownList
            id="periode"
            name="periode"
            label="Periode"
            listValues={period}
          />
        </div>
        <LineAreaChart />
      </div>

      <div className="flex flex-col w-full mt-2 gap-8 p-8">
        <div>
          <h1 className="text-[#113A5D] text-left body-2large-bold mb-2">
            Start creating data.
          </h1>
          <hr />
        </div>

        <div className="w-full flex items-center gap-5">
          <Link
            href="/products"
            className="flex w-8/12 justify-center items-center border border-[#ECEEF6] rounded-[16px] p-8 gap-4"
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <h2 className="body-extralarge-medium">Create new Product</h2>
              <h5 className="body-base-regular text-gray-400">
                Adding new products to the system.
              </h5>
            </div>
          </Link>

          <Link
            href="/serial-numbers"
            className="flex w-8/12 justify-center items-center border border-[#ECEEF6] rounded-[16px] p-8 gap-4"
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <h2 className="body-extralarge-medium">
                Create your Serial Number
              </h2>
              <h5 className="body-base-regular text-gray-400">
                Creates a new serial number automatically
              </h5>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
