import { ReactElement, useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Raleway } from "next/font/google";
import dayjs from "dayjs";
import type { NextPageWithLayout } from "../_app";
import { graphqlRequest } from "@/utils/graphql";
import SidebarLayout from "@/components/elements/SideBarLayout";
import { ProductSerials } from "@/types/productSerials";
import Loading from "@/components/elements/Loading";

const raleway = Raleway({ subsets: ["latin"] });

const findAllProductSerialsQuery = `
  query FindAllProductSerialsQuery {
    product_serials {
      capacity
      id
      product_id
      optical_power
      serial_number
      description
      created_at
      updated_at
      product {
        name
      }
    }
  }
`;

const deleteProductSerialsByIdMutation = `
  mutation DeleteProductSerialsById($id: bigint!) {
    delete_product_serials_by_pk(id: $id) {
      capacity
      id
      product_id
      optical_power
      serial_number
      description
      created_at
      updated_at
      product {
        name
      }
    }
  }
`;

type PageProps = {
  productSerials?: Array<ProductSerials>;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  try {
    const result = await graphqlRequest.request<any>(
      findAllProductSerialsQuery,
      {}
    );

    return {
      props: {
        productSerials: result["product_serials"],
      },
    };
  } catch (err) {
    console.error(err);

    return {
      props: {
        productSerials: [],
      },
    };
  }
};

const SerialProducts: NextPageWithLayout<PageProps> = ({ productSerials }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
  }

  async function deleteProduct(id: string) {
    if (!router.isReady) return;

    try {
      setIsLoading(true);
      await graphqlRequest.request<any>(deleteProductSerialsByIdMutation, {
        id,
      });

      router.reload();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    setIsLoading(false);
  }, [productSerials]);

  return (
    <main className={`${raleway.className}`}>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="body-4large-bold font-semibold leading-6 text-[#113A5D]">
                Products Serials
              </h1>
              <p className="mt-4 body-base-regular text-gray-400">
                This feature aims to provide convenience in managing products
                that have serial numbers and make it easier for users to access
                information and manage serialized products.
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
                href="/product-serials/form"
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
              <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle">
                  <table className="min-w-full border-separate border-spacing-0">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                        >
                          Product Name
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                        >
                          Serial Number
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                        >
                          Attached Date
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                        >
                          <span className="sr-only">Action</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productSerials
                        ?.filter(
                          (item: any) =>
                            item.product.name
                              .toLowerCase()
                              .includes(searchValue) ||
                            item.serial_number
                              .toLowerCase()
                              .includes(searchValue)
                        )
                        .map((productSerial: any, productSerialIdx: number) => (
                          <tr key={productSerial.id}>
                            <td
                              className={classNames(
                                productSerialIdx !== productSerial.length - 1
                                  ? "border-b border-gray-200"
                                  : "",
                                "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                              )}
                            >
                              {productSerial.product.name}
                            </td>
                            <td
                              className={classNames(
                                productSerialIdx !== productSerial.length - 1
                                  ? "border-b border-gray-200"
                                  : "",
                                "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                              )}
                            >
                              {productSerial.serial_number}
                            </td>
                            <td
                              className={classNames(
                                productSerialIdx !== productSerial.length - 1
                                  ? "border-b border-gray-200"
                                  : "",
                                "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                              )}
                            >
                              {dayjs(productSerial.created_at).format(
                                "MMM D, YYYY"
                              )}
                            </td>
                            <td
                              className={classNames(
                                productSerialIdx !== productSerial.length - 1
                                  ? "border-b border-gray-200"
                                  : "",
                                "relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8"
                              )}
                            >
                              <Link
                                href={`/product-serials/form/${productSerial.id}`}
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
                                onClick={() => deleteProduct(productSerial.id)}
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
      )}
    </main>
  );
};

SerialProducts.getLayout = function getLayout(page: ReactElement) {
  // TODO: add session auth component
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default SerialProducts;
