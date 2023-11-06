import { ReactElement, useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Raleway } from "next/font/google";
import type { NextPageWithLayout } from "../../_app";
import { useForm, SubmitHandler } from "react-hook-form";
import swal from "sweetalert";
import { graphqlRequest } from "@/utils/graphql";
import SidebarLayout from "@/components/elements/SideBarLayout";
import Loading from "@/components/elements/Loading";
import Seo from "@/components/elements/Seo";
import { Product } from "@/types/product";
import { ProductSerials, ProductSerialsInput } from "@/types/productSerials";
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

const insertProductSerialsMutation = `
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

const findProductSerialsByIdQuery = `
  query FindProductSerialsByIdQuery($id: bigint!) {
    product_serials_by_pk(id: $id) {
        created_at
        description
        id
        updated_at
        capacity
        optical_power
        product_id
        serial_number
    }
  }
`;

const updateProductSerialsByIdMutation = `
  mutation UpdateProducSerialstById($id: bigint!, $serial_number: String!, $product_id: bigint!, $capacity: bigint, $optical_power: String, $description: String, $created_by: bigint!) {
    update_product_serials_by_pk(pk_columns: {id: $id}, _set: {serial_number: $serial_number, product_id: $product_id, capacity: $capacity, optical_power: $optical_power, description: $description, created_by: $created_by}) {
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
`;

type PageProps = {
  products?: Array<Product>;
  productSelected?: ProductSerials;
  user: User;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx
) => {
  superTokensNode.init(backendConfig());

  let session;
  let user;
  const { id } = ctx.query;
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
      findProductSerialsByIdQuery,
      {
        id,
      }
    );

    return {
      props: {
        products: result["products"],
        productSelected: resultSelected["product_serials_by_pk"],
        user,
      },
    };
  } catch (err) {
    console.error(err);

    return {
      props: {
        products: [],
        productSelected: [],
        user: {},
      },
    };
  }
};

const SerialProducts: NextPageWithLayout<PageProps> = ({
  products,
  productSelected,
  user,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductSerialsInput>();

  const onSubmit: SubmitHandler<ProductSerialsInput> = async (data) => {
    if (!router.isReady) return;

    const { id } = router.query;

    try {
      setIsLoading(true);
      if (id) {
        await graphqlRequest.request(updateProductSerialsByIdMutation, {
          ...data,
          capacity: data.capacity !== 0 ? data.capacity : 0,
          id,
          created_by: user?.id,
        });
      } else {
        await graphqlRequest.request(insertProductSerialsMutation, data);
      }
      swal({
        title: "Success!",
        text: "Your data has been saved!",
        icon: "success",
        closeOnClickOutside: false,
      }).then(() => {
        if (router.isReady) {
          router.push("/product-serials");
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
          router.push("/product-serials");
        }
      });
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, [productSelected]);

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
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        id="serial-number"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        defaultValue={productSelected?.serial_number ?? ""}
                        {...register("serial_number")}
                        required
                      />
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
                        defaultValue={productSelected?.product_id ?? ""}
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
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        defaultValue={productSelected?.capacity ?? 0}
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
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        defaultValue={productSelected?.optical_power ?? ""}
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
                        defaultValue={productSelected?.description ?? ""}
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
