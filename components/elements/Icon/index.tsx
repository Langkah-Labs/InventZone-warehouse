import React from "react";

export default function index() {
  return (
    <div className="flex gap-2 items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="35"
        height="50"
        fill="none"
      >
        <path
          fill="#113A5D"
          d="M30.175 14.627c0-2.795-1.176-4.57-3.528-5.325L1.04 1.042v39.457l13.874 4.486 11.733 3.774c2.352.755 3.528-.265 3.528-3.06V14.626Zm-3.528-5.325c2.352.755 3.528 2.53 3.528 5.325v25.83c2.405-.14 3.608-1.538 3.608-4.193V5.194C33.783 2.397 32.46 1 29.819 1H1v39.457h.04V1.042l25.607 8.26Z"
        />
        <path
          stroke="#2C5282"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M30.175 40.457c2.405-.14 3.608-1.538 3.608-4.193V5.194C33.783 2.397 32.46 1 29.819 1H1v39.457"
        />
        <path
          stroke="#2C5282"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth=".5"
          d="M1.04 40.457V1.042l25.607 8.26c2.352.755 3.528 2.53 3.528 5.325v25.83m-29.135 0v.042l13.874 4.486V8.8m15.261 31.658v5.241c0 2.796-1.176 3.816-3.528 3.061l-11.733-3.773M7.422 6.87v35.306m14.746-31.322v36.018"
        />
      </svg>
      <h1 className="font-medium body-base-semibold text-[#113A5D]">
        <b>INVENTZONE</b>
      </h1>
    </div>
  );
}
