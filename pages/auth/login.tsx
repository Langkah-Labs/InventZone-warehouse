import Link from "next/link";

import { Raleway } from "next/font/google";

const raleway = Raleway({ subsets: ["latin"] });

export default function Login() {
  return (
    <div className={`flex min-h-full flex-1 ${raleway.className}`}>
      <div
        className="relative hidden w-0 flex-1 lg:block"
        style={{
          background:
            "linear-gradient(180deg, #2A4365 -1.9%, rgba(146, 158, 164, 0.918713) 62.79%, rgba(255, 211, 85, 0.8) 100%)",
        }}
      >
        <div className="flex flex-col h-full text-white gap-4 justify-center items-center">
          <h1 className="font-bold text-2xl">Welcome back to</h1>
          <div className="flex gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="50"
              fill="none"
            >
              <path
                fill="#fff"
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
            <h1 className="font-medium text-3xl">INVENTZONE</h1>
          </div>
          <p>Start managing your assets better and faster</p>
          <Link
            href="/users/register"
            className="border-2 border-white rounded-sm py-4 px-14"
          >
            {"Don't have an account?"}
          </Link>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center py-12">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-[#2A4365] text-center">
            Log in your account
          </h2>

          <div className="mt-10">
            <div>
              <form action="#" method="POST" className="space-y-6">
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#4F99FF] sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="at least 8 characters"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#4F99FF] sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm leading-6">
                    <a
                      href="#"
                      className="font-semibold text-[#4F99FF] hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="flex w-fit justify-center rounded-md bg-[#4F99FF] px-8 py-4 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#3688fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
