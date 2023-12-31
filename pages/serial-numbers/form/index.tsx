import { ReactElement, useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Raleway } from "next/font/google";
import type { NextPageWithLayout } from "../../_app";
import { useForm, SubmitHandler } from "react-hook-form";
import swal from "sweetalert";
import { graphqlRequest } from "@/utils/graphql";
import { SerialNumberInput } from "@/types/serial-number";
import SidebarLayout from "@/components/elements/SideBarLayout";
import Loading from "@/components/elements/Loading";
import Seo from "@/components/elements/Seo";
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

const findPOQuery = `
  query GetSerialNumber($productOrderId: String!, $product_id: bigint!) {
    serial_numbers(
      where: {product_order_id: {_eq: $productOrderId}, product_id: {_eq: $product_id}}
    ) {
      id
      name: product_name
      product_id
      product_order_id
      quantity
      created_at
      updated_at
    }
  }
`;

const insertSerialNumberMutation = `
  mutation InsertSerialNumber($productOrderId: String!, $quantity: bigint!, $product_id: bigint!, $created_by: bigint!) {
    insert_serial_numbers_one(object: {product_id: $product_id, product_order_id: $productOrderId, quantity: $quantity, created_by: $created_by}) {
      id
      name: product_name
      product_id
      product_order_id
      quantity
      created_at
      updated_at
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

const SerialNumbers: NextPageWithLayout<PageProps> = ({ products, user }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SerialNumberInput>();

  const onSubmit: SubmitHandler<SerialNumberInput> = async (data) => {
    if (!router.isReady) return;

    try {
      setIsLoading(true);

      const resultSelected = await graphqlRequest.request<any>(findPOQuery, {
        productOrderId: data.productOrderId,
        product_id: data.product_id,
      });

      if (resultSelected.serial_numbers.length > 0) {
        swal({
          title: "Failed!",
          text: "Oops! It seems that you've already submitted this data before.",
          icon: "error",
          closeOnClickOutside: false,
        }).then(() => {
          if (router.isReady) {
            router.push("/serial-numbers");
          }
        });
      } else {
        await graphqlRequest.request(insertSerialNumberMutation, {
          ...data,
          created_by: user?.id,
        });
        swal({
          title: "Success!",
          text: "Your data has been saved!",
          icon: "success",
          closeOnClickOutside: false,
        }).then(() => {
          router.push("/serial-numbers");
        });
      }
    } catch (err) {
      console.error(err);
      swal({
        title: "Failed!",
        text: "Oops, something went wrong",
        icon: "error",
        closeOnClickOutside: false,
      }).then(() => {
        if (router.isReady) {
          router.push("/serial-numbers");
        }
      });
    }
  };

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
                  Serial Number
                </h2>
                <p className="mt-2 max-w-2xl leading-6 body-base-regular text-gray-400">
                  This information will be added as a new serial number data in
                  the system.
                </p>

                <div className="font-sans mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="productOrderId"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      No. PO
                      <span className="text-[#C23A3A]">*</span>
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        id="productOrderId"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        {...register("productOrderId")}
                        required
                      />
                    </div>
                  </div>

                  {/* <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >
                    Product Name
                    <span className="text-[#C23A3A]">*</span>
                  </label>
                  <div className="mt-2 sm:col-span-2 sm:mt-0">
                    <input
                      type="text"
                      id="name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      {...register("name")}
                    />
                  </div>
                </div> */}

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
                      htmlFor="quantity"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Qty.
                      <span className="text-[#C23A3A]">*</span>
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <input
                        type="number"
                        id="quantity"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        {...register("quantity")}
                        required
                      />
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
                href="/serial-numbers"
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

SerialNumbers.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default SerialNumbers;
