import { useState } from "react";
import Link from "next/link";
import { Raleway } from "next/font/google";
import { useForm, SubmitHandler } from "react-hook-form";
import { signUp } from "supertokens-web-js/recipe/emailpassword";
import TextField from "@/components/elements/TextField";
import Icon from "@/components/elements/Icon";

const raleway = Raleway({ subsets: ["latin"] });

type RegisterInput = {
  team: string;
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  phone: string;
};

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>();
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    passwordConfirmation: false,
  });

  const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
    try {
      let response = await signUp({
        formFields: [
          {
            id: "team",
            value: data.team,
          },
          {
            id: "username",
            value: data.username,
          },
          {
            id: "email",
            value: data.email,
          },
          {
            id: "password",
            value: data.password,
          },
          {
            id: "phone",
            value: data.phone,
          },
        ],
      });

      if (response.status === "FIELD_ERROR") {
        // one of the input formFields failed validaiton
        response.formFields.forEach((formField) => {
          if (formField.id === "email") {
            // Email validation failed (for example incorrect email syntax),
            // or the email is not unique.
            window.alert(formField.error);
          } else if (formField.id === "password") {
            // Password validation failed.
            // Maybe it didn't match the password strength
            window.alert(formField.error);
          }
        });
      } else {
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
    <div className={`flex flex-col p-8 ${raleway.className}`}>
      <Icon />
      <div className="flex h-full mt-24 items-center justify-center">
        <div className="flex flex-col gap-8">
          <div className="text-center">
            <h2 className="body-4large-bold text-[#113A5D]">
              Set New Password
            </h2>
            <h5 className="body-large-regular text-gray-400">
              Must be at least 8 characters.
            </h5>
          </div>
          <div className="flex flex-col gap-2">
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </div>
              <input
                type={protectedPassword(
                  passwordVisibility.passwordConfirmation
                )}
                id="passwordConfirmation"
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="New Password"
                aria-describedby="passwordConfirmation"
                {...register("passwordConfirmation")}
              />
              <button
                type="button"
                onClick={() => showPassword("passwordConfirmation")}
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

            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </div>
              <input
                type={protectedPassword(
                  passwordVisibility.passwordConfirmation
                )}
                id="passwordConfirmation"
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Confirm Password"
                aria-describedby="passwordConfirmation"
                {...register("passwordConfirmation")}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button className="inline-flex w-fit items-center gap-x-1.5 rounded-md bg-[#167AFF] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Reset Password
            </button>
          </div>

          <div className="flex justify-center">
            <Link
              href="/auth/login"
              className="text-gray-400 hover:underline hover:underline-offset-4"
            >
              &#8592;&nbsp;back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
