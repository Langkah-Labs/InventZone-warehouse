import React, { ReactNode } from "react";
import Thead from "@/components/elements/Table/Thead";

interface sourceType {
  title: string;
}

interface Props {
  headers: Array<sourceType>;
  children: ReactNode;
}

export default function index({ headers, children }: Props) {
  console.log(headers);

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8 overflow-x-auto">
        <div className="inline-block min-w-full align-middle h-[32rem] overflow-y-scroll scroll-smooth">
          <table className="min-w-full border-separate border-spacing-0 font-sans">
            <thead>
              <tr>
                {headers?.map((item: any) => (
                  <>
                    <Thead title={item.title} />
                  </>
                ))}
                <th
                  scope="col"
                  className="sticky top-0 z-10 border-b uppercase border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-bold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                >
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>{children}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
