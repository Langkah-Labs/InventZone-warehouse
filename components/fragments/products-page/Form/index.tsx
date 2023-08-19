import React from "react";
import Link from "next/link";
import TextArea from "@/components/elements/Form/TextArea";
import InputField from "@/components/elements/Form/InputField";

export default function index() {
  return (
    <form>
      <div className="space-y-12 sm:space-y-16">
        <div>
          <h2 className="body-4large-bold leading-7 text-[#113A5D]">Product</h2>
          <p className="mt-2 max-w-2xl leading-6 body-base-regular text-gray-400">
            This information will be added as a new product in the system.
          </p>

          <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
            <InputField
              id="product-name"
              name="product-name"
              label="Product Name"
              isRequired={true}
            />

            <TextArea
              id="description"
              name="description"
              label="Description"
              placeholder="Write a few sentences about the product."
            />
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
  );
}
