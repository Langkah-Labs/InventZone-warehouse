import { ReactElement } from "react";
import Link from "next/link";
import { Raleway } from "next/font/google";
import type { NextPageWithLayout } from "../../_app";
import { useForm, SubmitHandler } from "react-hook-form";
import { graphqlRequest } from "@/utils/graphql";
import { useRouter } from "next/router";
import SidebarLayout from "@/components/elements/SideBarLayout";
import { ProductSerialsInput } from "@/types/productSerials";
import { GetServerSideProps } from "next";
import { Product } from "@/types/product";

const raleway = Raleway({ subsets: ["latin"] });

const findAllProductsQuery = `
  query FindAllProductsQuery {
    products {
      id
      name
      created_at
      updated_at
    }
  }
`;

const insertProductSerialMutation = `
  mutation InsertProductSerialsMutation($serial_number: String!, $product_id: bigint!, $capacity: bigint, $optical_power: String, $description: String) {
    insert_product_serials(objects: {serial_number: $serial_number, product_id: $product_id, capacity: $capacity, optical_power: $optical_power, description: $description}) {
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
};

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  try {
    const result = await graphqlRequest.request<any>(findAllProductsQuery, {});

    return {
      props: {
        products: result["products"],
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

const SerialProducts: NextPageWithLayout<PageProps> = ({ products }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductSerialsInput>();

  const onSubmit: SubmitHandler<ProductSerialsInput> = async (data) => {
    if (!router.isReady) return;

    try {
      await graphqlRequest.request(insertProductSerialMutation, data);

      router.push("/product-serials");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <main className={`${raleway.className}`}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12 sm:space-y-16">
          <div>
            <h2 className="body-4large-bold leading-7 text-[#113A5D]">
              Product Serials
            </h2>
            <p className="mt-2 max-w-2xl leading-6 body-base-regular text-gray-400">
              This information will be added as a new serialized product in the
              system.
            </p>

            <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
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
                    defaultValue={""}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    {...register("serial_number")}
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
                    defaultValue=""
                    {...register("product_id")}
                  >
                    {products?.map((item: any, i: number) => (
                      <option value={item.id} key={i}>
                        {item.name}
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
                    type="text"
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
              <b>Note:&nbsp;</b>(<span className="text-[#C23A3A]">*</span>) is
              required
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
    </main>
  );
};

SerialProducts.getLayout = function getLayout(page: ReactElement) {
  // TODO: add session auth component
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default SerialProducts;
