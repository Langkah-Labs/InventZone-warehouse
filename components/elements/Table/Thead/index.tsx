import React from "react";

interface Props {
  title: string;
}

export default function index({ title }: Props) {
  return (
    <>
      <th
        scope="col"
        className="sticky top-0 z-10 border-b uppercase border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-bold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
      >
        {title}
      </th>
    </>
  );
}
