import { ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Raleway } from "next/font/google";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import swal from "sweetalert";
import type { NextPageWithLayout } from "../../_app";
import SidebarLayout from "@/components/elements/SideBarLayout";

const raleway = Raleway({ subsets: ["latin"] });

type RoleInput = {
  role: string;
  permissions: Array<string>;
  description?: string;
};

const CreateRole: NextPageWithLayout = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RoleInput>();

  const onSubmit: SubmitHandler<RoleInput> = async (data) => {
    if (!router.isReady) return;

    const response = await fetch("/api/users/roles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const body = await response.json();
    if (body.status === "OK" && body.createdNewRole) {
      swal({
        title: "Success!",
        text: "Your data has been saved!",
        icon: "success",
      }).then(() => {
        router.push("/users/roles");
      });
    } else {
      swal({
        title: "Failed!",
        text: "Oops, something went wrong",
        icon: "error",
      }).then(() => {
        if (router.isReady) {
          router.push("/users/roles");
        }
      });
    }
  };

  return (
    <main className={`${raleway.className}`}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12 sm:space-y-16">
          <div>
            <h2 className="body-4large-bold leading-7 text-[#113A5D]">Role</h2>
            <p className="mt-2 max-w-2xl leading-6 body-base-regular text-gray-400">
              Role data entry form. This form provides information from the role
              name and description.
            </p>

            <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  Role
                  <span className="text-[#C23A3A]">*</span>
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <input
                    type="text"
                    id="role"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    defaultValue={""}
                    required
                    {...register("role")}
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  Description
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <textarea
                    id="description"
                    rows={3}
                    className="block w-full max-w-2xl rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={""}
                    {...register("description")}
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  Permissions
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <fieldset>
                    <legend className="sr-only">Permissions</legend>
                    <div className="space-y-5">
                      <div className="relative flex items-start">
                        <div className="flex h-6 items-center">
                          <Controller
                            name="permissions.0"
                            control={control}
                            defaultValue="read"
                            render={() => (
                              <input
                                id="read"
                                aria-describedby="read-description"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                value="read"
                              />
                            )}
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label
                            htmlFor="read"
                            className="font-medium text-gray-900"
                          >
                            Read
                          </label>
                          <p id="read-description" className="text-gray-500">
                            Able to read all data in the app
                          </p>
                        </div>
                      </div>
                      <div className="relative flex items-start">
                        <div className="flex h-6 items-center">
                          <Controller
                            name="permissions.1"
                            control={control}
                            defaultValue="write"
                            render={() => (
                              <input
                                id="write"
                                aria-describedby="write-description"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                value="write"
                              />
                            )}
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label
                            htmlFor="write"
                            className="font-medium text-gray-900"
                          >
                            Write
                          </label>
                          <p id="write-description" className="text-gray-500">
                            Able to write data to the database
                          </p>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
              <b>Note:&nbsp;</b>(<span className="text-[#C23A3A]">*</span>) is
              required
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Link
            href="/users/roles/"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-[#113A5D] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </main>
  );
};

CreateRole.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default CreateRole;
