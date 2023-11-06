import { ReactElement, useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Raleway } from "next/font/google";
import type { NextPageWithLayout } from "../_app";
import swal from "sweetalert";
import { Switch } from "@headlessui/react";
import { graphqlRequest } from "@/utils/graphql";
import { randomSerialNumber } from "@/utils/constants";
import SidebarLayout from "@/components/elements/SideBarLayout";
import InfoAlert from "@/components/elements/Modals/InfoAlert";
import FormAlert from "@/components/elements/Modals/FormAlert";
import SuccessAlert from "@/components/elements/Modals/SuccessAlert";
import Loading from "@/components/elements/Loading";
import Seo from "@/components/elements/Seo";
import Header from "@/components/elements/Header";
import Table from "@/components/elements/Table";
import Tbody from "@/components/elements/Table/Tbody";
import { SerialNumber } from "@/types/serial-number";
import superTokensNode from "supertokens-node";
import { backendConfig } from "@/config/backendConfig";
import Session from "supertokens-node/recipe/session";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import { User } from "@/types/user";

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
      status
      verification
      created_by
      product {
        name
        shorten_name
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

const updateVerificationByIdMutation = `
  mutation UpdateSerialNumberById($id: bigint!, $verification: Boolean!) {
    update_serial_numbers_by_pk(pk_columns: {id: $id}, _set: {verification: $verification}) {
      id
      product_name
      product_order_id
      quantity
      created_at
      updated_at
      status
      verification
    }
  }
`;

const findUserByEmailQuery = `
  query FindUserByEmail($email: String!) {
    users(where: {email: {_eq: $email}}) {
      id
      name
      role
      email
      phone
      username
      company
      serial_numbers_remaining
    }
  }
`;

const insertGeneratedSerialNumbersMutation = `
  mutation InsertGeneratedSerialNumbers($objects: [generated_serial_numbers_insert_input!]!) {
    insert_generated_serial_numbers(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

const decrementSerialNumberCounterMutation = `
  mutation DecrementSerialNumberCounter($id: bigint!, $serialNumberRemaining: Int!) {
    update_users_by_pk(pk_columns: {id: $id}, _set: {serial_numbers_remaining: $serialNumberRemaining}) {
      serial_numbers_remaining
    }
  }
`;

const updateSerialNumberStatusMutation = `
  mutation UpdateSerialNumberStatus($id: bigint!, $status: Boolean!) {
    update_serial_numbers_by_pk(pk_columns: {id: $id}, _set: {status: $status}) {
      id
      status
    }
  }
`;

type PageProps = {
  serialNumbers: Array<SerialNumber>;
  user: User;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx
) => {
  superTokensNode.init(backendConfig());

  let session;
  let user;

  try {
    session = await Session.getSession(ctx.req, ctx.res, {
      overrideGlobalClaimValidators: () => {
        return [];
      },
    });
    const userInfo = await EmailPassword.getUserById(session!.getUserId());
    if (userInfo) {
      const userResult = await graphqlRequest.request<any>(
        findUserByEmailQuery,
        {
          email: userInfo.email,
        }
      );

      user = userResult["users"][0];
    }

    const result = await graphqlRequest.request<any>(
      findAllSerialNumbersQuery,
      {}
    );

    return {
      props: {
        serialNumbers: result["serial_numbers"],
        user,
      },
    };
  } catch (err) {
    console.error(err);

    return {
      props: {
        serialNumbers: [],
        user: {},
      },
    };
  }
};

const SerialNumbers: NextPageWithLayout<PageProps> = ({
  serialNumbers,
  user,
}) => {
  const headers = [
    {
      title: "Number PO",
    },
    {
      title: "Product Name",
    },
    {
      title: "Qty",
    },
  ];
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [generateValue, setGenerateValue] = useState([""]);
  const [snValue, setSnValue] = useState(serialNumbers);
  // const [isClickedVerification, setIsClickedVerification] = useState(false);
  const [isClickedGenerate, setIsClickedGenerate] = useState(false);
  const [isClickedEmail, setIsClickedEmail] = useState(false);
  const [isClickedSuccess, setIsClickedSuccess] = useState(false);
  const [isEnableVerification, setIsEnableVerification] = useState(false);
  const [isEnableGenerate, setIsEnableGenerate] = useState(false);

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
  }

  const verificationHandler = (id: string) => {
    swal({
      title: "Data Verification",
      text: "If you verified the data, your verification will be sent to vendor and the data status will be verified",
      icon: "warning",
      buttons: ["No, maybe later", "Yes,I want to verified"],
      dangerMode: false,
      closeOnClickOutside: false,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          setIsLoading(true);
          const res = await graphqlRequest.request<any>(
            updateVerificationByIdMutation,
            {
              verification: true,
              id,
            }
          );
          if (res) {
            swal({
              title: "Success!",
              text: "Data is verified!",
              icon: "success",
              closeOnClickOutside: false,
            }).then(() => {
              router.reload();
            });
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        swal("It's okay, you can do it later");
      }
    });
  };

  const generateHandler = async (
    id: string,
    name: string,
    qty: number,
    created_by: string
  ) => {
    if (!router.isReady) return;

    setIsLoading(true);

    if (user?.role === "demo") {
      const generationRemaining = user["serial_numbers_remaining"] || 0;

      if (generationRemaining < 1) {
        swal({
          title: "Account Limit Exceeded",
          text: "Oops, the serial number generation for your account has reached its limit",
          icon: "error",
          closeOnClickOutside: false,
        }).then(() => {
          router.reload();
          setIsLoading(false);
        });

        return;
      }
    }

    const serialNumbers = randomSerialNumber(name, created_by, qty);
    setGenerateValue(serialNumbers);

    try {
      const objects = serialNumbers.map((serialNumber) => ({
        code: serialNumber,
        serial_number_id: id,
        created_by: created_by,
      }));

      await graphqlRequest.request<any>(insertGeneratedSerialNumbersMutation, {
        objects: objects,
      });

      if (serialNumbers) {
        if (user?.role === "demo" && user["serial_numbers_remaining"]) {
          const serialNumberRemaining =
            user["serial_numbers_remaining"] - serialNumbers.length;

          await graphqlRequest.request<any>(
            decrementSerialNumberCounterMutation,
            {
              id: user?.id,
              serialNumberRemaining,
            }
          );
        }

        // set status to true in the serial_numbers table
        await graphqlRequest.request<any>(updateSerialNumberStatusMutation, {
          id,
          status: true,
        });

        setIsLoading(false);
        setIsClickedGenerate((prevValue) => !prevValue);
      }
    } catch (err) {
      swal({
        title: "Failed!",
        text: "Oops, something went wrong",
        icon: "error",
        closeOnClickOutside: false,
      }).then(() => {
        router.reload();
        setIsLoading(false);
      });
    }
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
      closeOnClickOutside: false,
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
    if (isEnableGenerate) {
      const res = serialNumbers.filter(
        (item: any) => item.status === isEnableGenerate
      );
      setSnValue(res);
    } else if (isEnableVerification) {
      const res = serialNumbers.filter(
        (item: any) => item.verification === isEnableVerification
      );
      setSnValue(res);
    }
    if (!isEnableGenerate && !isEnableVerification) {
      setSnValue(serialNumbers);
    }
  }, [serialNumbers, isEnableGenerate, isEnableVerification]);

  return (
    <div>
      <Seo title="InventZone" />
      <main className={`${raleway.className}`}>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="px-4 sm:px-6 lg:px-8">
            <Header
              title="Serial Number"
              desc="This feature aims to be able to create a new serial number
            that is valid and can be used in the system."
              searchValue={searchValue}
              searchHandler={(props) => setSearchValue(props)}
              path="/serial-numbers/form"
            />
            <div className="flex justify-end items-center gap-4 my-2">
              Filter by:
              <Switch.Group as="div" className="flex items-center">
                <Switch
                  checked={isEnableVerification}
                  onChange={setIsEnableVerification}
                  className={classNames(
                    isEnableVerification ? "bg-indigo-600" : "bg-gray-200",
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      isEnableVerification ? "translate-x-5" : "translate-x-0",
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    )}
                  />
                </Switch>
                <Switch.Label as="span" className="ml-1 text-sm">
                  <span className="font-medium text-gray-900">Verified</span>
                </Switch.Label>
              </Switch.Group>
              <Switch.Group as="div" className="flex items-center">
                <Switch
                  checked={isEnableGenerate}
                  onChange={setIsEnableGenerate}
                  className={classNames(
                    isEnableGenerate ? "bg-indigo-600" : "bg-gray-200",
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      isEnableGenerate ? "translate-x-5" : "translate-x-0",
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    )}
                  />
                </Switch>
                <Switch.Label as="span" className="ml-1 text-sm">
                  <span className="font-medium text-gray-900">Generated</span>
                </Switch.Label>
              </Switch.Group>
            </div>
            <div>
              <Table headers={headers}>
                {snValue
                  .filter(
                    (item: any) =>
                      item?.product?.name
                        .toLowerCase()
                        .includes(searchValue?.toLowerCase()) ||
                      item?.product?.shorten_name
                        .toLowerCase()
                        .includes(searchValue?.toLowerCase()) ||
                      item?.product_order_id
                        .toLowerCase()
                        .includes(searchValue?.toLowerCase()) ||
                      item?.quantity === parseInt(searchValue, 10)
                  )
                  .map((serialNumber: any, serialNumbersIdx: number) => (
                    <tr key={serialNumber?.id}>
                      <Tbody
                        index={serialNumbersIdx}
                        length={serialNumber.length}
                        title={serialNumber?.product_order_id}
                        isCapitalize={true}
                      />
                      <Tbody
                        index={serialNumbersIdx}
                        length={serialNumber.length}
                        title={`${serialNumber?.product?.name} - (${serialNumber?.product?.shorten_name})`}
                      />
                      <Tbody
                        index={serialNumbersIdx}
                        length={serialNumber.length}
                        title={serialNumber?.quantity}
                      />
                      <td
                        className={classNames(
                          serialNumbersIdx !== serialNumber.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm sm:pr-8 lg:pr-8"
                        )}
                      >
                        {!serialNumber?.verification && (
                          <>
                            <Link
                              href={`/serial-numbers/form/${serialNumber?.id}`}
                              className="inline-flex items-center gap-x-1.5 rounded-md bg-[#167AFF] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                />
                              </svg>
                            </Link>
                            <button
                              onClick={() =>
                                deleteSerialNumber(serialNumber?.id)
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
                          </>
                        )}
                        {!serialNumber?.verification ? (
                          <div
                            className="cursor-pointer inline-flex items-center gap-x-1.5 ml-2 rounded-md bg-[#129483ff] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            data-te-toggle="tooltip"
                            title="Verify Data"
                            onClick={() =>
                              verificationHandler(serialNumber?.id)
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
                                d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div
                            className="inline-flex items-center gap-x-1.5 ml-2 rounded-md bg-gray-400 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            data-te-toggle="tooltip"
                            title="Data Verified"
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
                          </div>
                        )}
                        {serialNumber?.verification && (
                          <>
                            {!serialNumber?.status ? (
                              <div
                                className="cursor-pointer inline-flex items-center gap-x-1.5 ml-2 rounded-md bg-[#FFD335] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                data-te-toggle="tooltip"
                                title="Generate Serial Number"
                                onClick={() =>
                                  generateHandler(
                                    serialNumber?.id,
                                    serialNumber?.product?.shorten_name,
                                    Number(serialNumber?.quantity),
                                    serialNumber?.created_by
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
                            ) : (
                              <Link
                                href={`/serial-numbers/detail/${serialNumber?.id}?no_po=${serialNumber?.product_order_id}`}
                                className="cursor-pointer inline-flex items-center gap-x-1.5 ml-2 rounded-md bg-[#d6e1b8] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                data-te-toggle="tooltip"
                                title="View Generate Serial Number"
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
                                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                              </Link>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
              </Table>
              {isClickedGenerate ? (
                <InfoAlert
                  title="Generate Serial Number"
                  description="Your serial number has been generated!"
                  labelAction1="Share to email"
                  labelAction2="Export CSV"
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
                  actionHandler={clickSuccessHandler}
                  rejectHandler={() =>
                    setIsClickedEmail((prevValue) => !prevValue)
                  }
                  show={isClickedEmail}
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
    </div>
  );
};

SerialNumbers.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default SerialNumbers;
