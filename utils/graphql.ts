import { GraphQLClient } from "graphql-request";

const GRAPHQL_BASE_URL = process.env.GRAPHQL_ENDPOINT || "";

const requestHeaders = {
  "x-hasura-admin-secret": process.env.GRAPHQL_ADMIN_SECRET || "",
};

const graphqlRequest = new GraphQLClient(GRAPHQL_BASE_URL, {
  headers: requestHeaders,
});

export { graphqlRequest };
