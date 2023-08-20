import React from "react";
import { Props } from "./type";

export default function index({
  id,
  name,
  label,
  placeholder,
  listValues,
  isRequired
}: Props) {
  return (
    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
      >
        {label}
        {isRequired ? <span className="text-[#C23A3A]">*</span> : <></>}
      </label>
      <div className="mt-2 sm:col-span-2 sm:mt-0">
        <select
          id={id}
          name={name}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          defaultValue=""
        >
          {listValues?.map((item, i) => (
            <option value={item.value} key={i}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
