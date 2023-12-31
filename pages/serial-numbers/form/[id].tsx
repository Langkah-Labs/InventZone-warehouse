import { ReactElement, useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Raleway } from "next/font/google";
import { useForm, SubmitHandler } from "react-hook-form";
import swal from "sweetalert";
import type { NextPageWithLayout } from "../../_app";
import { graphqlRequest } from "@/utils/graphql";
import SidebarLayout from "@/components/elements/SideBarLayout";
import Loading from "@/components/elements/Loading";
import Seo from "@/components/elements/Seo";
import { Product } from "@/types/product";
import { SerialNumber, SerialNumberInput } from "@/types/serial-number";
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

const findSerialNumeberByIdQuery = `
  query FindSerialNumberById($id: bigint!) {
    serial_numbers_by_pk(id: $id) {
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

const updateSerialNumberByIdMutation = `
  mutation UpdateSerialNumberById(
    $id: bigint!,
    $name: String,
    $productOrderId: String!,
    $quantity: bigint!,
    $product_id: bigint!,
    $created_by: bigint!
  ) {
    update_serial_numbers_by_pk(pk_columns: {id: $id}, _set: {id: $id, product_name: $name, product_order_id: $productOrderId, quantity: $quantity, product_id: $product_id, created_by: $created_by}) {
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
  serialNumber?: SerialNumber;
  user: User;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx
) => {
  const { id } = ctx.query;
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

    const resultSelected = await graphqlRequest.request<any>(
      findSerialNumeberByIdQuery,
      {
        id,
      }
    );

    return {
      props: {
        products: result["products"],
        serialNumber: resultSelected["serial_numbers_by_pk"],
        user,
      },
    };
  } catch (err) {
    console.error(err);

    return {
      props: {
        products: [],
        serialNumber: [],
        user: {},
      },
    };
  }
};

const SerialNumbers: NextPageWithLayout<PageProps> = ({
  products,
  serialNumber,
  user,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SerialNumberInput>();

  const onSubmit: SubmitHandler<SerialNumberInput> = async (data) => {
    if (!router.isReady) return;

    const { id } = router.query;

    try {
      setIsLoading(true);
      await graphqlRequest.request(updateSerialNumberByIdMutation, {
        ...data,
        product_id: serialNumber?.product_id,
        productOrderId: serialNumber?.product_order_id,
        id,
        created_by: user?.id,
      });

      swal({
        title: "Success!",
        text: "Your data has been saved!",
        icon: "success",
        closeOnClickOutside: false,
      }).then(() => {
        if (router.isReady) {
          router.push("/serial-numbers");
        }
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
                        {...register("productOrderId")}
                        type="text"
                        id="productOrderId"
                        className="block w-full disabled:bg-slate-100 disabled:text-slate-400 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        // defaultValue={serialNumber?.product_order_id ?? ""}
                        value={serialNumber?.product_order_id}
                        required
                        disabled
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
                      defaultValue={serialNumber?.name ?? ""}
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
                        {...register("product_id")}
                        id="product-name"
                        className="block w-full disabled:bg-slate-100 disabled:text-slate-400 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        defaultValue={serialNumber?.product_id ?? ""}
                        required
                        disabled
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
                        {...register("quantity")}
                        type="number"
                        id="quantity"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        defaultValue={serialNumber?.quantity ?? ""}
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
