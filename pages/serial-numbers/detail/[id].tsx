import { ReactElement, useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { Raleway } from "next/font/google";
import type { NextPageWithLayout } from "../../_app";
import { graphqlRequest } from "@/utils/graphql";
import Seo from "@/components/elements/Seo";
import { GeneratedSerialNumber } from "@/types/serial-number";

const raleway = Raleway({ subsets: ["latin"] });

const findSerialNumeberByIdQuery = `
  query FindSerialNumberById($serial_number_id: bigint!) {
    generated_serial_numbers(where: {serial_number_id: {_eq: $serial_number_id}}) {
        id
        serial_number_id
        code
        created_by
        created_at
        updated_at
    }
  }
`;

type PageProps = {
  generated_serial_numbers?: Array<GeneratedSerialNumber>;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx
) => {
  const { id } = ctx.query;

  try {
    const resultSelected = await graphqlRequest.request<any>(
      findSerialNumeberByIdQuery,
      {
        serial_number_id: id,
      }
    );

    return {
      props: {
        generated_serial_numbers: resultSelected["generated_serial_numbers"],
      },
    };
  } catch (err) {
    console.error(err);

    return {
      props: {
        products: [],
      },
    };
  }
};

const Index: NextPageWithLayout<PageProps> = ({ generated_serial_numbers }) => {
  const [isClickedEmail, setIsClickedEmail] = useState(false);
  const [isClickedDownload, setIsClickedDownload] = useState(false);

  const emailHandler = () => {
    setIsClickedEmail(!isClickedEmail);
  };

  const downloadHandler = () => {
    setIsClickedDownload(!isClickedDownload);
  };
  return (
    <div>
      <Seo title="InventZone" />
      <div className={`${raleway.className}`}>
        <div className="rounded-lg p-8 text-sky-600 underline underline-offset-4 shadow-md">
          <Link href="/serial-numbers" className="hover:text-sky-800">
            &#9664;&nbsp;Serial Number
          </Link>
        </div>
        <div className="flex flex-col w-full gap-4 p-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="body-4large-bold font-semibold leading-6 text-[#113A5D]">
                Serial Number
              </h1>
              <p className="mt-4 body-base-regular text-gray-400">
                This feature aims to be able to create a new serial number that
                is valid and can be used in the system
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex items-center gap-2">
              <div
                onClick={() => emailHandler()}
                className="inline-flex items-center gap-x-1.5 rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
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
                    d="M7.875 14.25l1.214 1.942a2.25 2.25 0 001.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 011.872 1.002l.164.246a2.25 2.25 0 001.872 1.002h2.092a2.25 2.25 0 001.872-1.002l.164-.246A2.25 2.25 0 0116.954 9h4.636M2.41 9a2.25 2.25 0 00-.16.832V12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 01.382-.632l3.285-3.832a2.25 2.25 0 011.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0021.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
                Share via Email
              </div>
              <div
                onClick={() => downloadHandler()}
                className="inline-flex items-center gap-x-1.5 rounded-md bg-[#129483ff] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
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
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                Export CSV
              </div>
            </div>
          </div>
          <div>
            <div className="flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300 font-sans">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                        >
                          No
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                        >
                          Serial Number
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {generated_serial_numbers?.map((item: any, i: number) => (
                        <tr key={item.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            {i + 1}
                          </td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            {item.code}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
