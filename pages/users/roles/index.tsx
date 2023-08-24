import Link from "next/link";
import SidebarLayout from "@/components/elements/SideBarLayout";
import { Raleway } from "next/font/google";
import { ReactElement } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import type { NextPageWithLayout } from "../../_app";
import { Role } from "@/types/role";
import { GetServerSideProps } from "next";
import supertokensNode from "supertokens-node";
import { backendConfig } from "@/config/backendConfig";
import UserRoles from "supertokens-node/recipe/userroles";
import { useRouter } from "next/router";

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

  const deleteRole = async (role: string) => {
    if (!router.isReady) return;

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
  };

  return (
    <main className={`${raleway.className}`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Role List Table
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              This is data from role table, press button to update or delete.
            </p>
          </div>
          <div className="flex gap-2 mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Search for roles"
              />
            </div>
            <Link
              href="/users/roles/new"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add new
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
                  {roles?.map(({ role }) => (
                    <tr key={role}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {role}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <button
                          onClick={() => deleteRole(role)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Delete<span className="sr-only">, {role}</span>
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
