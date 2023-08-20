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
              Forgot Password?
            </h2>
            <h5 className="body-large-regular text-gray-400">
              No worries, we will sent you reset instructions.
            </h5>
          </div>
          <div>
            <TextField
              label="email"
              name="email"
              placeholder="example@mail.com"
              isMail={true}
            />
          </div>
          <div className="flex justify-center">
            <button className="inline-flex w-fit items-center gap-x-1.5 rounded-md bg-[#167AFF] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Send Instructions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
