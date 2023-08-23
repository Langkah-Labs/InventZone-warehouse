import Link from "next/link";
import SidebarLayout from "@/components/elements/SideBarLayout";
import { Raleway } from "next/font/google";
import { ReactElement } from "react";
import type { NextPageWithLayout } from "../../_app";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import { SerialNumber, SerialNumberInput } from "@/types/serial-number";
import { graphqlRequest } from "@/utils/graphql";
import { GetServerSideProps } from "next";

const raleway = Raleway({ subsets: ["latin"] });

const findSerialNumeberByIdQuery = `
  query FindSerialNumberById($id: bigint!) {
    serial_numbers_by_pk(id: $id) {
      id
      name: product_name
      productOrderId: product_order_id
      quantity
      created_at
      updated_at
    }
  }
`;

const updateSerialNumberByIdMutation = `
  mutation UpdateSerialNumberById(
    $id: bigint!,
    $name: String!,
    $productOrderId: String!,
    $quantity: bigint!
  ) {
    update_serial_numbers_by_pk(pk_columns: {id: $id}, _set: {id: $id, product_name: $name, product_order_id: $productOrderId, quantity: $quantity}) {
      id
      name: product_name
      productOrderId: product_order_id
      quantity
      created_at
      updated_at
    }
  }
`;

type PageProps = {
  serialNumber: SerialNumber;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx
) => {
  const { id } = ctx.query;

  try {
    const result = await graphqlRequest.request<any>(
      findSerialNumeberByIdQuery,
      { id }
    );

    return {
      props: {
        serialNumber: result["serial_numbers_by_pk"],
      },
    };
  } catch (err) {
    console.error(err);

    return {
      props: {
        serialNumber: {},
      },
    };
  }
};

const SerialNumbers: NextPageWithLayout<PageProps> = ({ serialNumber }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SerialNumberInput>();

  const onSubmit: SubmitHandler<SerialNumberInput> = async (data) => {
    if (!router.isReady) return;

    const { id } = router.query;

    try {
      await graphqlRequest.request(updateSerialNumberByIdMutation, {
        ...data,
        id,
      });

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
                    defaultValue={serialNumber?.productOrderId ?? ""}
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
                    defaultValue={serialNumber?.name ?? ""}
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
                    defaultValue={serialNumber?.quantity ?? ""}
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
