import { atomsWithQuery } from "jotai-tanstack-query";
import request from "graphql-request";

const findAllProductsQuery = `
  query FindAllProductsQuery {
    products {
      id
      name
      created_at
      updated_at
    }
  }
`;

// TODO: save static token to env vars
const requestHeaders = {
  "x-hasura-admin-secret": "InventZone_2023",
};

const [productsAtom] = atomsWithQuery((get) => {
  return {
    queryKey: [],
    queryFn: async () => {
      const result = await request(
        // TODO: save graphql endpoint url to env vars
        "http://191.96.57.242:8080/v1/graphql",
        findAllProductsQuery,
        {},
        requestHeaders
      );
      return result;
    },
  };
});

export { productsAtom };
