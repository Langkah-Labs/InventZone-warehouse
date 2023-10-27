import { useState } from "react";
import Link from "next/link";
import { Raleway } from "next/font/google";
import { useForm, SubmitHandler } from "react-hook-form";
import { sendPasswordResetEmail } from "supertokens-web-js/recipe/emailpassword";
import swal from "sweetalert";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { ThreeDots } from "react-loader-spinner";

const raleway = Raleway({ subsets: ["latin"] });

interface ForgotPasswordInput {
  email: string;
}

function DotsSpinner() {
  return (
    <div className="flex justify-center items-center h-full">
      <ThreeDots
        height="24"
        width="24"
        color="#ffffff"
        ariaLabel="three-dots-loading"
        radius="4"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
}

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<ForgotPasswordInput>();

  const onSubmitResetPassword: SubmitHandler<ForgotPasswordInput> = async (
    data
  ) => {
    try {
      setIsLoading(true);

      let response = await sendPasswordResetEmail({
        formFields: [
          {
            id: "email",
            value: data.email,
          },
        ],
      });

      if (response.status === "OK") {
        swal({
          title: "Success!",
          text: "Please check your email for the password reset link",
          icon: "success",
        });
      } else if (response.status === "FIELD_ERROR") {
        swal({
          title: "Failed!",
          text: "Oops, submit form failed please check your fields",
          icon: "error",
        });
      } else {
        swal({
          title: "Failed!",
          text: "Oops, failed to reset your password",
          icon: "error",
        });
      }

      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      swal({
        title: "Failed!",
        text: "Oops, something went wrong",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center items-center lg:px-8 bg-gray-100 h-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Forgot Password?
        </h2>
        <h5 className="body-large-regular text-gray-400 text-center">
          No worries, we will sent you reset instructions.
        </h5>
      </div>

      <div className="mt-8 w-4/12 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmitResetPassword)}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <EnvelopeIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                {...register("email")}
                type="email"
                id="email"
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-[#113A5D] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isLoading ? <DotsSpinner /> : "Submit"}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Have an account?
          <Link
            href="/auth/login"
            className="font-semibold leading-6 text-[#167AFF] hover:opacity-80"
          >
            &nbsp;Login
          </Link>
        </p>
      </div>
    </div>
  );
}
