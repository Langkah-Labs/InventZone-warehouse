import { ReactElement } from "react";
import Link from "next/link";
import { Raleway } from "next/font/google";
import type { NextPageWithLayout } from "./_app";
import supertokensNode from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import { backendConfig } from "../config/backendConfig";
import { graphqlRequest } from "@/utils/graphql";
import {
  BookmarkSquareIcon,
  DocumentDuplicateIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import SidebarLayout from "@/components/elements/SideBarLayout";
import Seo from "@/components/elements/Seo";
import { User } from "@/types/user";
import EmailPassword from "supertokens-node/recipe/emailpassword";

const raleway = Raleway({ subsets: ["latin"] });

const countAllProductsQuery = `
  query CountAllProductsQuery {
    products_aggregate {
      aggregate {
        count
      }
    }
  }
`;

const countAllSerialNumberQuery = `
  query CountAllSerialNumberQuery {
    serial_numbers_aggregate {
      aggregate {
        count
      }
    }
  }
`;

const countAllProductSerialsQuery = `
  query CountAllProductsQuery {
    product_serials_aggregate {
      aggregate {
        count
      }
    }
  }
`;

const findUserByEmailQuery = `
  query FindUserByEmail($email: String!) {
    users(where: {email: {_eq: $email}}) {
      id
      name
      role
      email
      phone
      username
      company
    }
  }
`;

type aggregateObject = {
  aggregate: {
    count: number;
  };
};

type PageProps = {
  products_aggregate?: aggregateObject;
  serial_numbers_aggregate?: aggregateObject;
  product_serials_aggregate?: aggregateObject;
  user: User;
};

export async function getServerSideProps(context: any) {
  supertokensNode.init(backendConfig());

  let session;
  let user;

  try {
    session = await Session.getSession(context.req, context.res, {
      overrideGlobalClaimValidators: () => {
        return [];
      },
    });
    const userInfo = await EmailPassword.getUserById(session!.getUserId());
    if (userInfo) {
      const userResult = await graphqlRequest.request<any>(
        findUserByEmailQuery,
        {
          email: userInfo.email,
        }
      );

      user = userResult["users"][0];
    }

    const resultProducts = await graphqlRequest.request<any>(
      countAllProductsQuery,
      {}
    );
    const resultSerialNumbers = await graphqlRequest.request<any>(
      countAllSerialNumberQuery,
      {}
    );
    const resultProductSerials = await graphqlRequest.request<any>(
      countAllProductSerialsQuery,
      {}
    );

    return {
      props: {
        products_aggregate: resultProducts["products_aggregate"],
        serial_numbers_aggregate:
          resultSerialNumbers["serial_numbers_aggregate"],
        product_serials_aggregate:
          resultProductSerials["product_serials_aggregate"],
        user,
      },
    };
  } catch (err: any) {
    if (err.type === Session.Error.TRY_REFRESH_TOKEN) {
      // in this case, the session is still valid, only the access token has expired.
      // The refresh token is not sent to this route as it's tied to the /api/auth/session/refresh API paths.
      // So we must send a "signal" to the frontend which will then call the
      // refresh API and reload the page.

      return { props: { fromSupertokens: "needs-refresh" } };
      // or return {fromSupertokens: 'needs-refresh'} in case of getInitialProps
    } else if (err.type === Session.Error.UNAUTHORISED) {
      // in this case, there is no session, or it has been revoked on the backend.
      // either way, sending this response will make the frontend try and refresh
      // which will fail and redirect the user to the login screen.
      return { props: { fromSupertokens: "needs-refresh" } };
    }

    throw err;
  }

  // return {
  //   props: { userId: session!.getUserId()},
  // };
}

const Home: NextPageWithLayout<PageProps> = ({
  products_aggregate,
  serial_numbers_aggregate,
  product_serials_aggregate,
  user,
}) => {
  const stats = [
    {
      id: 1,
      name: "Total Products",
      stat: `${products_aggregate?.aggregate.count}`,
      icon: CalendarIcon,
      url: "/products",
    },
    {
      id: 2,
      name: "Total Generated Serial Number",
      stat: `${serial_numbers_aggregate?.aggregate.count}`,
      icon: DocumentDuplicateIcon,
      url: "/serial-numbers",
    },
    {
      id: 3,
      name: "Total Serialized Products",
      stat: `${product_serials_aggregate?.aggregate.count}`,
      icon: BookmarkSquareIcon,
      url: "/product-serials",
    },
  ];

  return (
    <div>
      <Seo title="InventZone" />
      <main className={`${raleway.className}`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex-grow sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="body-4large-bold font-semibold leading-6 text-[#113A5D]">
                Hello, {user?.name}
              </h1>
              <p className="mt-4 body-base-regular text-gray-400">
                View your current product progress.
              </p>
            </div>
          </div>

          <div className="mt-8 p-8 border border-[#ECEEF6] rounded-[16px]">
            {/* <div className="flex justify-between">
          <h2 className="text-[#113A5D] text-left body-2large-bold">
            Activity
          </h2>
          <DropdownList id="periode" name="periode" listValues={period} />
        </div> */}
            {/* <LineAreaChart /> */}
            <div>
              <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((item) => (
                  <div
                    key={item.id}
                    className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
                  >
                    <dt>
                      <div className="absolute rounded-md bg-[#113A5D] p-3">
                        <item.icon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="ml-16 truncate text-sm font-medium text-gray-500">
                        {item.name}
                      </p>
                    </dt>
                    <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                      <p className="text-2xl font-semibold text-gray-900">
                        {item.stat}
                      </p>
                      <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                        <div className="text-sm">
                          <a
                            href="#"
                            className="font-medium text-[#113A5D] hover:text-indigo-500"
                          >
                            View all
                            <span className="sr-only"> {item.name} stats</span>
                          </a>
                        </div>
                      </div>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="flex flex-col w-full mt-2 gap-8 p-8">
            <div>
              <h1 className="text-[#113A5D] text-left body-2large-bold mb-2">
                Start creating data.
              </h1>
              <hr />
            </div>

            <div className="w-full flex items-center gap-5">
              <Link
                href="/products/form"
                className="flex w-8/12 justify-center items-center border border-[#ECEEF6] rounded-[16px] p-8 gap-4"
              >
                <div>
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
                      d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
                    />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <h2 className="body-extralarge-medium">Create new Product</h2>
                  <h5 className="body-base-regular text-gray-400">
                    Adding new products to the system.
                  </h5>
                </div>
              </Link>

              <Link
                href="/serial-numbers/form"
                className="flex w-8/12 justify-center items-center border border-[#ECEEF6] rounded-[16px] p-8 gap-4"
              >
                <div>
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
                      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                    />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <h2 className="body-extralarge-medium">
                    Create your Serial Number
                  </h2>
                  <h5 className="body-base-regular text-gray-400">
                    Creates a new serial number automatically
                  </h5>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default Home;
