import Link from "next/link";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "supertokens-web-js/recipe/emailpassword";

import { Raleway } from "next/font/google";

const raleway = Raleway({ subsets: ["latin"] });

type LoginInput = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>();

  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
  });

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    try {
      let response = await signIn({
        formFields: [
          {
            id: "email",
            value: data.email,
          },
          {
            id: "password",
            value: data.password,
          },
        ],
      });

      if (response.status === "FIELD_ERROR") {
        response.formFields.forEach((formField) => {
          if (formField.id === "email") {
            // Email validation failed (for example incorrect email syntax).
            window.alert(formField.error);
          }
        });
      } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
        window.alert("Email password combination is incorrect.");
      } else {
        // sign in successful. The session tokens are automatically handled by
        // the frontend SDK.
        window.location.href = "/";
      }
    } catch (err: any) {
      if (err.isSuperTokensGeneralError === true) {
        // this may be a custom error message sent from the API by you.
        window.alert(err.message);
      } else {
        window.alert("Oops! Something went wrong.");
      }
    }
  };

  const showPassword = (name: string) => {
    setPasswordVisibility((prevVal: any) => {
      return {
        ...prevVal,
        [name]: !prevVal[name],
      };
    });
  };

  const protectedPassword = (hidden: any) => (hidden ? "text" : "password");

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

          <div className="mt-10 font-sans">
            <div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="mt-2">
                  <div className="relative mt-2 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <svg
                        className="text-[#2A4365]"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                      >
                        <path
                          stroke="#2A4365"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"
                        />
                        <path
                          stroke="#2A4365"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m22 6-10 7L2 6"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="email"
                      className="block w-full bg-[#4F5C6233] rounded-md border-0 py-5 pl-14 pr-12 text-[#40404099] placeholder:text-[#40404099] focus:ring-2 focus:ring-inset focus:[#4F99FF] sm:text-sm sm:leading-6"
                      placeholder="you@example.com"
                      aria-describedby="email"
                      required
                      {...register("email")}
                    />
                  </div>
                </div>

                <div className="mt-2">
                  <div className="relative mt-2 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                      >
                        <path
                          stroke="#2A4365"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2ZM7 11V7a5 5 0 1 1 10 0v4"
                        />
                      </svg>
                    </div>
                    <input
                      type={protectedPassword(passwordVisibility.password)}
                      id="password"
                      className="block w-full bg-[#4F5C6233] rounded-md border-0 py-5 pl-14 pr-12 text-[#40404099] placeholder:text-[#40404099] focus:ring-2 focus:ring-inset focus:ring-[#4F99FF] sm:text-sm sm:leading-6"
                      placeholder="at least 8 characters"
                      aria-describedby="password"
                      required
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => showPassword("password")}
                      className="absolute inset-y-0 right-0 flex items-center pr-4"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                      >
                        <path
                          fill="#6D8098"
                          d="M24 12.425v-.572C20.735 7.446 16.75 5.16 12.044 5c-.015 0-.03 0-.046.002C7.133 5.188 3.134 7.492 0 11.913v.572c3.265 4.408 7.25 6.692 11.956 6.853h.042c4.866-.184 8.866-2.489 12.002-6.913Zm-6.835-.256c0 1.416-.505 2.625-1.513 3.627-1.009 1.001-2.226 1.502-3.652 1.502-1.426 0-2.643-.5-3.652-1.502-1.009-1.002-1.513-2.211-1.513-3.627s.504-2.625 1.513-3.626C9.357 7.54 10.574 7.04 12 7.04c1.426 0 2.643.5 3.652 1.503 1.008 1.001 1.513 2.21 1.513 3.626Zm-3.223-1.924a2.652 2.652 0 0 0-1.94-.797c-.757 0-1.404.265-1.94.797a2.615 2.615 0 0 0-.803 1.926c0 .754.268 1.397.804 1.929a2.652 2.652 0 0 0 1.94.798c.757 0 1.403-.266 1.939-.798a2.614 2.614 0 0 0 .806-1.929c0-.752-.269-1.394-.806-1.926Z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  {/* <div className="text-sm leading-6">
                    <Link
                      href="/users/forgot-password"
                      className="font-semibold text-[#4F99FF] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div> */}

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
