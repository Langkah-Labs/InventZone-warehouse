import { ReactElement, useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Raleway } from "next/font/google";
import supertokensNode from "supertokens-node";
import UserRoles from "supertokens-node/recipe/userroles";
import swal from "sweetalert";
import type { NextPageWithLayout } from "../../_app";
import { backendConfig } from "@/config/backendConfig";
import SidebarLayout from "@/components/elements/SideBarLayout";
import { Role } from "@/types/role";

const raleway = Raleway({ subsets: ["latin"] });

type PageProps = {
  roles?: Array<Role>;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  supertokensNode.init(backendConfig());

  try {
    const response = await UserRoles.getAllRoles();
    const roles = response.roles;

    let rolesResponse: Array<Role> = [];
    for (const role of roles) {
      const result = await UserRoles.getPermissionsForRole(role);
      if (result.status === "OK") {
        const { permissions } = result;
        rolesResponse = [
          ...rolesResponse,
          {
            role,
            permissions,
          },
        ];
      }
    }

    return {
      props: {
        roles: rolesResponse,
      },
    };
  } catch (err) {
    console.error(err);

    return {
      props: {
        roles: [],
      },
    };
  }
};

const Roles: NextPageWithLayout<PageProps> = ({ roles }) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const deleteRole = async (role: string) => {
    if (!router.isReady) return;

    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: ["Cancel", "Yes"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await fetch(`/api/user/roles/${role}`, {
            method: "DELETE",
          });
          const body = await response.json();

          if (body.status === "OK") {
            router.reload();
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        swal("Your record is safe!");
      }
    });
  };

  return (
    <main className={`${raleway.className}`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="body-4large-bold font-semibold leading-6 text-[#113A5D]">
              Roles
            </h1>
            <p className="mt-4 body-base-regular text-gray-400">
              This is data from role table, press button to update or delete.
            </p>
          </div>
          <div className="flex gap-2 mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <div className="relative rounded-md shadow-sm font-sans">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="text"
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
              />
            </div>
            <Link
              href="/users/roles/new"
              className="inline-flex items-center gap-x-1.5 rounded-md bg-[#113A5D] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
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
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
              Create New
            </Link>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Role Name
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                    >
                      <span className="sr-only">Delete</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {roles
                    ?.filter((item: any) =>
                      item.role.toLowerCase().includes(searchValue)
                    )
                    .map(({ role }) => (
                      <tr key={role}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {role}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <button
                            onClick={() => deleteRole(role)}
                            className="inline-flex items-center gap-x-1.5 ml-2 rounded-md bg-[#C23A3A] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

Roles.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default Roles;
