import React from "react";
import Link from "next/link";
import TextArea from "@/components/elements/Form/TextArea";
import InputField from "@/components/elements/Form/InputField";
import DropdownList from "@/components/elements/Form/DropdownList";

export default function index() {
  const products = [
    { value: 0, label: "Choose One" },
    { value: 1, label: "Optical Distribution Point" },
    { value: 2, label: "Indoor Cable" },
    { value: 3, label: "Optical Network Terminal" },
    { value: 4, label: "Optical Termination Premises" },
    { value: 5, label: "Set Top Box" },
  ];
  return (
    <form>
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
            <InputField
              id="serial-number"
              name="serial-number"
              label="Serial Number"
              isRequired={true}
            />

            <DropdownList
              id="product-name"
              name="product-name"
              label="Product Name"
              listValues={products}
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
  );
}
