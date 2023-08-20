import React from "react";
import Link from "next/link";
import TextField from "@/components/elements/TextField";
import Table from "@/components/fragments/serialNumbers-page/Table";

export default function index() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="body-4large-bold font-semibold leading-6 text-[#113A5D]">
            Serial Number
          </h1>
          <p className="mt-4 body-base-regular text-gray-400">
            This feature aims to be able to create a new serial number that is
            valid and can be used in the system
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex items-center gap-2">
          <div>
            <TextField label="search" name="search" placeholder="Search..." isSearch={true} />
          </div>
          <Link
            href="/serial-numbers/form"
            className="inline-flex items-center gap-x-1.5 rounded-md bg-[#113A5D] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
            Create New
          </Link>
        </div>
      </div>
      <div>
        <Table />
      </div>
    </div>
  );
}
