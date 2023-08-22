import { GraphQLClient } from "graphql-request";

// TODO: save graphql endpoint url to env vars
const GRAPHQL_BASE_URL = "http://191.96.57.242:8080/v1/graphql";

// TODO: save static token to env vars
const requestHeaders = {
  "x-hasura-admin-secret": "InventZone_2023",
};

const graphqlRequest = new GraphQLClient(GRAPHQL_BASE_URL, {
  headers: requestHeaders,
});

export { graphqlRequest };
