import { ReactElement, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Raleway } from "next/font/google";
import supertokensNode from "supertokens-node";
import UserRoles from "supertokens-node/recipe/userroles";
import swal from "sweetalert";
import type { NextPageWithLayout } from "../../_app";
import { backendConfig } from "@/config/backendConfig";
import SidebarLayout from "@/components/elements/SideBarLayout";
import Header from "@/components/elements/Header";
import Table from "@/components/elements/Table";
import Tbody from "@/components/elements/Table/Tbody";
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
  const headers = [
    {
      title: "Role Name",
    },
  ];
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
  }

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
        <Header
          title="Roles"
          desc="This is data from role table, press button to update or delete."
          searchValue={searchValue}
          searchHandler={(props) => setSearchValue(props)}
          path="/users/roles/new"
        />
        <div>
          <Table headers={headers}>
            {roles
              ?.filter((item: any) =>
                item.role.toLowerCase().includes(searchValue)
              )
              .map((roles: any, rolesIdx: number) => (
                <tr key={roles.role}>
                  <Tbody
                    index={rolesIdx}
                    length={roles.length}
                    title={roles?.role}
                  />
                  <td
                    className={classNames(
                      rolesIdx !== roles.length - 1
                        ? "border-b border-gray-200"
                        : "",
                      "relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm sm:pr-8 lg:pr-8"
                    )}
                  >
                    <button
                      onClick={() => deleteRole(roles.role)}
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
          </Table>
        </div>
      </div>
    </main>
  );
};

Roles.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default Roles;
