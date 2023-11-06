import { Fragment, ReactElement, useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { Raleway } from "next/font/google";
import { useForm, SubmitHandler } from "react-hook-form";
import swal from "sweetalert";
import { Transition, Combobox } from "@headlessui/react";
import type { NextPageWithLayout } from "../../_app";
import { graphqlRequest } from "@/utils/graphql";
import SidebarLayout from "@/components/elements/SideBarLayout";
import Loading from "@/components/elements/Loading";
import Seo from "@/components/elements/Seo";
import { ProductSerialsInput } from "@/types/productSerials";
import { Product } from "@/types/product";
import { User } from "@/types/user";
import superTokensNode from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import { backendConfig } from "@/config/backendConfig";
import EmailPassword from "supertokens-node/recipe/emailpassword";

const raleway = Raleway({ subsets: ["latin"] });

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

const findAllProductsQuery = `
  query FindAllProductsQuery {
    products {
      id
      name
      shorten_name
      created_at
      updated_at
    }
  }
`;

const findSerialNumber = `
  query SearchSerialNumbers($code: String!) {
    generated_serial_numbers(where: {code: {_iregex: $code}}) {
      code
    }
    product_serials {
      serial_number
    }
  }
`;

const insertProductSerialMutation = `
  mutation InsertProductSerialsMutation($serial_number: String!, $product_id: bigint!, $capacity: bigint, $optical_power: String, $description: String, $created_by: bigint!) {
    insert_product_serials(objects: {serial_number: $serial_number, product_id: $product_id, capacity: $capacity, optical_power: $optical_power, description: $description, created_by: $created_by}) {
      affected_rows
      returning {
        capacity
        id
        product_id
        optical_power
        serial_number
        description
        created_at
        updated_at
      }
    }
  }
`;

type PageProps = {
  products?: Array<Product>;
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

    const result = await graphqlRequest.request<any>(findAllProductsQuery, {});

    return {
      props: {
        products: result["products"],
        user,
      },
    };
  } catch (err) {
    console.error(err);

    return {
      props: {
        products: [],
        user: {},
      },
    };
  }
};

const SerialProducts: NextPageWithLayout<PageProps> = ({ products, user }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchValue, setSearchValue] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductSerialsInput>();

  const onSubmit: SubmitHandler<ProductSerialsInput> = async (data) => {
    if (!router.isReady) return;

    try {
      setIsLoading(true);
      await graphqlRequest.request(insertProductSerialMutation, {
        ...data,
        capacity: data.capacity !== 0 ? data.capacity : 0,
        created_by: user?.id,
      });

      swal({
        title: "Success!",
        text: "Your data has been saved!",
        icon: "success",
        closeOnClickOutside: false,
      }).then(() => {
        router.push("/product-serials");
      });
    } catch (err) {
      console.error(err);
      swal({
        title: "Failed!",
        text: "Oops, something went wrong",
        icon: "error",
        closeOnClickOutside: false,
      }).then(() => {
        if (router.isReady) {
          router.push("/product-serials");
        }
      });
    }
  };

  const resetHandler = () => {
    setSearchTerm("");
    setSelectedItem(null);
  };

  useEffect(() => {
    setIsLoading(true);
    const searchHandler = async () => {
      const resultSelected = await graphqlRequest.request<any>(
        findSerialNumber,
        {
          code: searchTerm,
        }
      );
      const codes = resultSelected.generated_serial_numbers.map(
        (item: any) => item.code
      );
      const serialNumbers = resultSelected.product_serials.map(
        (item: any) => item.serial_number
      );
      const unregisteredCodes = codes.filter(
        (code: any) => !serialNumbers.includes(code)
      );

      setSearchValue(unregisteredCodes);
    };
    searchHandler();
    setIsLoading(false);
  }, [searchTerm]);
  return (
    <div>
      <Seo title="InventZone" />
      <main className={`${raleway.className}`}>
        {isLoading ? (
          <Loading />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-12 sm:space-y-16">
              <div>
                <h2 className="body-4large-bold leading-7 text-[#113A5D]">
                  Product Serials
                </h2>
                <p className="mt-2 max-w-2xl leading-6 body-base-regular text-gray-400">
                  This information will be added as a new serialized product in
                  the system.
                </p>

                <div className="font-sans mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="serial-number"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Serial Number
                      <span className="text-[#C23A3A]">*</span>
                    </label>
                    <div className="w-80 relative">
                      <Combobox value={selectedItem} onChange={setSelectedItem}>
                        {({ open }) => (
                          <>
                            <div className="relative mt-2 sm:col-span-2 sm:mt-0">
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
                              <Combobox.Input
                                type="text"
                                placeholder="Type your serial number..."
                                value={selectedItem ?? searchTerm}
                                {...register("serial_number")}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                              />
                              {(selectedItem || searchTerm !== "") && (
                                <div
                                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                  onClick={() => resetHandler()}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-4 h-4"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <Transition show={open} as={Fragment}>
                              <Combobox.Options className="w-full bg-white absolute z-50 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                {isLoading && (
                                  <p className="text-gray-500 px-4 py-2">
                                    Loading...
                                  </p>
                                )}
                                {searchTerm &&
                                  searchValue.map((item) => (
                                    <Combobox.Option
                                      key={item}
                                      value={item}
                                      className={({ active, selected }) =>
                                        `${
                                          active
                                            ? "text-white bg-indigo-600"
                                            : "text-gray-900"
                                        } cursor-pointer select-none relative py-2 pl-3 pr-9`
                                      }
                                    >
                                      {item}
                                    </Combobox.Option>
                                  ))}
                              </Combobox.Options>
                            </Transition>
                          </>
                        )}
                      </Combobox>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="product-name"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Product name
                      <span className="text-[#C23A3A]">*</span>
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <select
                        id="product-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        defaultValue=""
                        {...register("product_id")}
                        required
                      >
                        <option value="">Choose One</option>
                        {products?.map((item: any, i: number) => (
                          <option value={item.id} key={i}>
                            {item.name}&nbsp;-&nbsp;({item.shorten_name})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="capacity"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Capacity
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <input
                        type="number"
                        id="capacity"
                        defaultValue={0}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        {...register("capacity")}
                      />
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        Please fill this field if the product is ODP.
                      </p>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="optical-power"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Optical Power
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        id="optical-power"
                        defaultValue={""}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        {...register("optical_power")}
                      />
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        Please fill this field if the product is ODP.
                      </p>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Description
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <textarea
                        id="description"
                        rows={3}
                        className="block w-full max-w-2xl rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={""}
                        {...register("description")}
                      />
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        Write a few sentences about the product.
                      </p>
                    </div>
                  </div>
                </div>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                  <b>Note:&nbsp;</b>(<span className="text-[#C23A3A]">*</span>)
                  is required
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Link
                href="/product-serials"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md bg-[#113A5D] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

SerialProducts.getLayout = function getLayout(page: ReactElement) {
  // TODO: add session auth component
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default SerialProducts;
