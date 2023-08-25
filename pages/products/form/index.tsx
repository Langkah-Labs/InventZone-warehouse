import { ReactElement, useState } from "react";
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
import { ProductInput } from "@/types/product";

const raleway = Raleway({ subsets: ["latin"] });

const insertProductMutation = `
  mutation InsertProductMutation($name: String!, $description: String!, $shorten_name: String!) {
    insert_products_one(object: {name: $name, description: $description, shorten_name: $shorten_name}) {
      id
      name
      shorten_name
      description
      created_at
      updated_at
    }
  }
`;

const Products: NextPageWithLayout = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductInput>();

  const onSubmit: SubmitHandler<ProductInput> = async (data) => {
    if (!router.isReady) return;

    try {
      setIsLoading(true);
      await graphqlRequest.request(insertProductMutation, data);

      swal({
        title: "Success!",
        text: "Your data has been saved!",
        icon: "success",
        closeOnClickOutside: false,
      }).then(() => {
        router.push("/products");
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
          router.push("/products");
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
                  Product
                </h2>
                <p className="mt-2 max-w-2xl leading-6 body-base-regular text-gray-400">
                  This information will be added as a new product in the system.
                </p>

                <div className="font-sans mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
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
                        defaultValue={""}
                        required
                        {...register("name")}
                      />
                      {/* <p className="mt-3 text-sm leading-6 text-gray-600">{hint}</p> */}
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="shorten-name"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Shorten Name
                      <span className="text-[#C23A3A]">*</span>
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        id="shorten-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        defaultValue={""}
                        required
                        {...register("shorten_name")}
                      />
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        ex: &quot;Optical Distribution Point&quot; &gt;
                        &quot;ODP&quot;
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
        )}
      </main>
    </div>
  );
};

Products.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default Products;
