import Link from "next/link";
import SidebarLayout from "@/components/elements/SideBarLayout";
import { Raleway } from "next/font/google";
import { ReactElement } from "react";
import type { NextPageWithLayout } from "../../_app";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import { SerialNumberInput } from "@/types/serial-number";
import { graphqlRequest } from "@/utils/graphql";

const raleway = Raleway({ subsets: ["latin"] });

const insertSerialNumberMutation = `
  mutation InsertSerialNumber($productOrderId: String!, $name: String!, $quantity: bigint!) {
    insert_serial_numbers_one(object: {product_name: $name, product_order_id: $productOrderId, quantity: $quantity}) {
      id
      name: product_name
      product_order_id
      quantity
      created_at
      updated_at
    }
  }
`;

const SerialNumbers: NextPageWithLayout = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SerialNumberInput>();

  const onSubmit: SubmitHandler<SerialNumberInput> = async (data) => {
    if (!router.isReady) return;

    try {
      await graphqlRequest.request(insertSerialNumberMutation, data);

      router.push("/serial-numbers");
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
              Serial Number
            </h2>
            <p className="mt-2 max-w-2xl leading-6 body-base-regular text-gray-400">
              This information will be added as a new serial number data in the
              system.
            </p>

            <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
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
                  />
                </div>
              </div>

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
                    {...register("name")}
                  />
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
                    type="text"
                    id="quantity"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    {...register("quantity")}
                  />
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
    </main>
  );
};

SerialNumbers.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default SerialNumbers;
