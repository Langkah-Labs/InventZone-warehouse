import React from "react";
import Link from "next/link";

interface Props {
  title: string;
  desc: string;
  searchValue: string | number;
  searchHandler: (props: string) => void;
  path: string;
}

export default function index({ title, desc, searchHandler, searchValue, path }: Props) {
  return (
    <div className="sm:flex sm:items-center">
      <div className="sm:flex-auto">
        <h1 className="body-4large-bold font-semibold leading-10 text-[#113A5D]">
          {title}
        </h1>
        <p className="mt-4 body-base-regular text-gray-400">
          {desc}
        </p>
      </div>
      <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex items-center gap-2">
        <div>
          <div className="relative rounded-md shadow-sm font-sans">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              id="text"
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => {
                searchHandler(e.target.value);
              }}
            />
          </div>
        </div>
        <Link
          href={path}
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
  );
}
