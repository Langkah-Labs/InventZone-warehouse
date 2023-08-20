import type { Props } from "./type";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Index({ label, name, placeholder, isSearch }: Props) {
  return (
    <div className="relative rounded-md shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {isSearch ?? <MagnifyingGlassIcon />}
      </div>
      <input
        type="text"
        name={name}
        id="text"
        className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder={placeholder}
      />
    </div>
  );
}
