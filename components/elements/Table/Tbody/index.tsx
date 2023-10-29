import React from "react";

interface Props {
  index: number;
  length: number;
  title: string;
}

export default function index({ index, length, title }: Props) {
  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
  }
  return (
    <>
      <td
        className={classNames(
          index !== length - 1 ? "border-b border-gray-200" : "",
          "whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6 lg:pl-8"
        )}
      >
        {title}
      </td>
    </>
  );
}
