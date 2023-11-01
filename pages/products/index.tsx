import { ReactElement, useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Raleway } from "next/font/google";
import type { NextPageWithLayout } from "../_app";
import { graphqlRequest } from "@/utils/graphql";
import swal from "sweetalert";
import SidebarLayout from "@/components/elements/SideBarLayout";
import Loading from "@/components/elements/Loading";
import Seo from "@/components/elements/Seo";
import Header from "@/components/elements/Header";
import Table from "@/components/elements/Table";
import Tbody from "@/components/elements/Table/Tbody";
import { Product } from "@/types/product";

const raleway = Raleway({ subsets: ["latin"] });

const findAllProductsQuery = `
  query FindAllProductsQuery {
    products {
      id
      name
      shorten_name
      created_at
      updated_at
    }
  }
`;

const deleteProductByIdMutation = `
  mutation DeleteProductById($id: bigint!) {
    delete_products_by_pk(id: $id) {
      id
      name
      shorten_name
      description
      created_at
      updated_at
    }
  }
`;

type PageProps = {
  products?: Array<Product>;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  try {
    const result = await graphqlRequest.request<any>(findAllProductsQuery, {});

    return {
      props: {
        products: result["products"],
      },
    };
  } catch (err) {
    console.error(err);

    return {
      props: {
        products: [],
      },
    };
  }
};

const Products: NextPageWithLayout<PageProps> = ({ products }) => {
  const headers = [
    {
      title: "Product Name",
    },
    {
      title: "Shorten Name",
    },
  ];
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
  }

  async function deleteProduct(id: string) {
    if (!router.isReady) return;

    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: ["Cancel", "Yes"],
      dangerMode: true,
      closeOnClickOutside: false,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          setIsLoading(true);
          await graphqlRequest.request<any>(deleteProductByIdMutation, {
            id,
          });
          router.reload();
        } catch (err) {
          console.error(err);
        }
      } else {
        swal("Your record is safe!");
      }
    });
  }

  useEffect(() => {
    setIsLoading(false);
  }, [products]);

  return (
    <div>
      <Seo title="InventZone" />
      <main className={`${raleway.className}`}>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="px-4 sm:px-6 lg:px-8">
            <Header
              title="Products"
              desc="This feature aims to provide easy and efficient access in
              managing products, including viewing, adding, changing, and
              deleting products."
              searchValue={searchValue}
              searchHandler={(props) => setSearchValue(props)}
              path="/products/form"
            />
            <div>
              <Table headers={headers}>
                {products
                  ?.filter(
                    (item: any) =>
                      item.name
                        .toLowerCase()
                        .includes(searchValue.toLowerCase()) ||
                      item.shorten_name
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                  )
                  .map((product: any, productIdx: number) => (
                    <tr key={product.id}>
                      <Tbody
                        index={productIdx}
                        length={product.length}
                        title={product?.name}
                      />
                      <Tbody
                        index={productIdx}
                        length={product.length}
                        title={product?.shorten_name}
                        isCapitalize={true}
                      />
                      <td
                        className={classNames(
                          productIdx !== product.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8"
                        )}
                      >
                        <Link
                          href={`/products/form/${product.id}`}
                          className="inline-flex items-center gap-x-1.5 rounded-md bg-[#167AFF] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                        </Link>
                        <button
                          onClick={() => deleteProduct(product.id)}
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
        )}
      </main>
    </div>
  );
};

Products.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default Products;
