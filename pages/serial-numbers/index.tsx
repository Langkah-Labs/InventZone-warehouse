import { ReactElement, useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Raleway } from "next/font/google";
import type { NextPageWithLayout } from "../_app";
import swal from "sweetalert";
import { graphqlRequest } from "@/utils/graphql";
import SidebarLayout from "@/components/elements/SideBarLayout";
import ConfirmAlert from "@/components/elements/Modals/ConfirmationAlert";
import InfoAlert from "@/components/elements/Modals/InfoAlert";
import FormAlert from "@/components/elements/Modals/FormAlert";
import SuccessAlert from "@/components/elements/Modals/SuccessAlert";
import Loading from "@/components/elements/Loading";
import { SerialNumber } from "@/types/serial-number";

const raleway = Raleway({ subsets: ["latin"] });

const findAllSerialNumbersQuery = `
  query FindAllSerialNumbers {
    serial_numbers {
      id
      product_id
      quantity
      product_name
      product_order_id
      created_at
      updated_at
      product {
        name
      }
    }
  }
`;

const deleteSerialNumberByIdMutation = `
  mutation DeleteSerialNumber($id: bigint!) {
    delete_serial_numbers(where: {id: {_eq: $id}}) {
      returning {
        id
        product_name
        product_order_id
        quantity
        created_at
        updated_at
      }
    }
  }
`;

type PageProps = {
  serialNumbers: Array<SerialNumber>;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  try {
    const result = await graphqlRequest.request<any>(
      findAllSerialNumbersQuery,
      {}
    );

    return {
      props: {
        serialNumbers: result["serial_numbers"],
      },
    };
  } catch (err) {
    console.error(err);

    return {
      props: {
        serialNumbers: [],
      },
    };
  }
};

const SerialNumbers: NextPageWithLayout<PageProps> = ({ serialNumbers }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [generateValue, setGenerateValue] = useState([""]);
  const [isClickedVerification, setIsClickedVerification] = useState(false);
  const [isClickedGenerate, setIsClickedGenerate] = useState(false);
  const [isClickedEmail, setIsClickedEmail] = useState(false);
  const [isClickedSuccess, setIsClickedSuccess] = useState(false);

  const clickVerificationHandler = () => {
    setIsClickedVerification(!isClickedVerification);
  };

  const clickGenerateHandler = (name: string, qty: number) => {
    setIsLoading(true);
    // Get the company name
    const serialNumber = randomSerialNumber(name, "KDK", qty);
    setGenerateValue(serialNumber);

    if (serialNumber) {
      setIsLoading(false);
      setIsClickedGenerate(!isClickedGenerate);
    }
  };

  const randomSerialNumber = (name: string, id: string, qty: number) => {
    let randomNumber = "";
    let result = [];
    const integers = "0123456789";

    // Get length for loop
    var charactersLength = integers.length;

    // Loop for total number of integers object
    for (let j = 0; j < qty; j++) {
      // Loop for total number of character each integers object
      randomNumber = "";
      for (let i = 0; i < 8; i++) {
        // Get character
        randomNumber += integers.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }

      // Get Date
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      const yyyy = today.getFullYear();
      const dateNow = dd + mm + yyyy;

      // Generate serial number
      const SN = name + id + randomNumber + dateNow;

      // Collect serial number to array
      result.push(SN);
    }
    return result;
  };

  const clickEmailHandler = () => {
    setIsClickedEmail(!isClickedEmail);
  };

  const clickSuccessHandler = () => {
    setIsClickedSuccess(!isClickedSuccess);
  };

  const deleteSerialNumber = async (id: string) => {
    if (!router.isReady) return;

    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: ["Cancel", "Yes"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          setIsLoading(true);
          await graphqlRequest.request<any>(deleteSerialNumberByIdMutation, {
            id,
          });

          router.reload();
        } catch (err) {
          console.error(err);
        }
      } else {
        swal("Your record is safe!");
      }
    });
  };

  useEffect(() => {
    setIsLoading(false);
  }, [serialNumbers]);

  return (
    <main className={`${raleway.className}`}>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="px-4 sm:px-6 lg:px-8">
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
              <div>
                <div className="relative rounded-md shadow-sm">
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
                      setSearchValue(e.target.value);
                    }}
                  />
                </div>
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
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                        >
                          Number PO
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                        >
                          Product Name
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                        >
                          Qty
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                        >
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {serialNumbers
                        .filter((item: any) =>
                          item.product.name.toLowerCase().includes(searchValue)
                        )
                        .map((serialNumber) => (
                          <tr key={serialNumber.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                              {serialNumber.product_order_id}
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                              {serialNumber.product.name}
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                              {serialNumber.quantity}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                              <Link
                                href={`/serial-numbers/form/${serialNumber.id}`}
                                className="inline-flex items-center gap-x-1.5 rounded-md bg-[#167AFF] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                                  />
                                </svg>
                              </Link>
                              <button
                                onClick={() =>
                                  deleteSerialNumber(serialNumber.id)
                                }
                                className="inline-flex items-center gap-x-1.5 ml-2 rounded-md bg-[#C23A3A] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                  />
                                </svg>
                              </button>
                              <div
                                className="cursor-pointer inline-flex items-center gap-x-1.5 ml-2 rounded-md bg-[#129483ff] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                data-te-toggle="tooltip"
                                title="Verify Data"
                                onClick={() => clickVerificationHandler()}
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
                                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                                  />
                                </svg>
                                <div
                                  id="tooltip-default"
                                  role="tooltip"
                                  className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                                >
                                  Tooltip content
                                  <div
                                    className="tooltip-arrow"
                                    data-popper-arrow
                                  ></div>
                                </div>
                              </div>
                              <div
                                className="cursor-pointer inline-flex items-center gap-x-1.5 ml-2 rounded-md bg-[#718096ff] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                data-te-toggle="tooltip"
                                title="Generate Serial Number"
                                onClick={() =>
                                  clickGenerateHandler(
                                    serialNumber.name,
                                    Number(serialNumber.quantity)
                                  )
                                }
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
                                    d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122"
                                  />
                                </svg>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {isClickedVerification ? (
              <ConfirmAlert
                title="Data Verification"
                description="If you verified the data, your verification will be sent to vendor and the data status will be verified"
                labelAccept="Yes,I want to verified"
                labelReject="No, maybe later"
              />
            ) : (
              <></>
            )}
            {isClickedGenerate ? (
              <InfoAlert
                title="Generate Serial Number"
                description="Your serial number has been generated!"
                labelAction1="Share to email"
                labelAction2="Download File"
                labelReject="Back"
                actionHandler1={clickEmailHandler}
                actionHandler2={clickSuccessHandler}
              />
            ) : (
              <></>
            )}
            {isClickedEmail ? (
              <FormAlert
                title="Share to email"
                description="Enter email to send the serial number file"
                labelAction="Send email"
                labelReject="Back"
                actionHandler1={clickSuccessHandler}
              />
            ) : (
              <></>
            )}
            {isClickedSuccess ? (
              <SuccessAlert
                title="Success!"
                description="You got your own serial number!"
                labelReject="Back"
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

SerialNumbers.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default SerialNumbers;
