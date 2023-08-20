import React from "react";
import { Props } from "./type";

export default function index({
  id,
  name,
  label,
  placeholder,
  listValues,
}: Props) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
        defaultValue=""
      >
        {listValues?.map((item, i) => (
          <option value={item.value} key={i}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
