import React from "react";
import { Props } from "./type";

export default function index({ id, label, name, placeholder }: Props) {
  return (
    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
      >
        {label}
      </label>
      <div className="mt-2 sm:col-span-2 sm:mt-0">
        <textarea
          id={id}
          name={name}
          rows={3}
          className="block w-full max-w-2xl rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          defaultValue={""}
        />
        <p className="mt-3 text-sm leading-6 text-gray-600">{placeholder}</p>
      </div>
    </div>
  );
}
