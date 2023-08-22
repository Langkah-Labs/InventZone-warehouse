import SidebarLayout from "@/components/elements/SideBarLayout";
import { Raleway } from "next/font/google";
import { ReactElement } from "react";
import Link from "next/link";
import type { NextPageWithLayout } from "../../_app";
import { useForm, SubmitHandler } from "react-hook-form";
import { graphqlRequest } from "@/utils/graphql";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { Product, ProductInput } from "@/types/product";

const raleway = Raleway({ subsets: ["latin"] });

const insertProductMutation = `
  mutation InsertProductMutation($name: String!, $description: String!) {
    insert_products_one(object: {name: $name, description: $description}) {
      id
      name
      description
      created_at
      updated_at
    }
  }
`;

const findProductByIdQuery = `
  query FindProductByIdQuery($id: bigint!) {
    products_by_pk(id: $id) {
      created_at
      description
      id
      name
      updated_at
    }
  }
`;

const updateProductByIdMutation = `
  mutation UpdateProductById($id: bigint!, $name: String!, $description: String!) {
    update_products_by_pk(pk_columns: {id: $id}, _set: {name: $name, description: $description}) {
      id
      name
      description
      created_at
      updated_at
    }
  }
`;

type PageProps = {
  product?: Product;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx
) => {
  const { id } = ctx.query;

  try {
    const result = await graphqlRequest.request<any>(findProductByIdQuery, {
      id,
    });

    return {
      props: {
        product: result["products_by_pk"],
      },
    };
  } catch (err) {
    console.error(err);

    return {
      props: {
        product: {},
      },
    };
  }
};

const Products: NextPageWithLayout<PageProps> = ({ product }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductInput>();

  const onSubmit: SubmitHandler<ProductInput> = async (data) => {
    console.log(data);

    if (!router.isReady) return;

    const { id } = router.query;

    try {
      if (id) {
        await graphqlRequest.request(updateProductByIdMutation, {
          ...data,
          id,
        });
      } else {
        await graphqlRequest.request(insertProductMutation, data);
      }

      if (router.isReady) {
        router.push("/products");
      }
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
              Product
            </h2>
            <p className="mt-2 max-w-2xl leading-6 body-base-regular text-gray-400">
              This information will be added as a new product in the system.
            </p>

            <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
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
                    defaultValue={product?.name ?? ""}
                    {...register("name")}
                  />
                  {/* <p className="mt-3 text-sm leading-6 text-gray-600">{hint}</p> */}
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
                    defaultValue={product?.description ?? ""}
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
            href="/products"
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

Products.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default Products;
