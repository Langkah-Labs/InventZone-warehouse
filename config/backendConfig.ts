import EmailPasswordNode from "supertokens-node/recipe/emailpassword";
import SessionNode from "supertokens-node/recipe/session";
import Dashboard from "supertokens-node/recipe/dashboard";
import UserRoles from "supertokens-node/recipe/userroles";
import { appInfo } from "./appInfo";
import { TypeInput } from "supertokens-node/types";
import { graphqlRequest } from "@/utils/graphql";

const insertOneUserMutation = `
  mutation InsertOneUserMutation(
    $name: String!,
    $phone: String!,
    $email: String!,
    $username: String!,
    $company: String!
  ) {
    insert_users_one(object: {name: $name, phone: $phone, email: $email, username: $username, company: $company}) {
      id
      name
      username
      phone
      email
      company
      created_at
      updated_at
    }
  }
`;

export const backendConfig = (): TypeInput => {
  return {
    framework: "express",
    supertokens: {
      // https://try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
      connectionURI: "http://191.96.57.242:3567",
      // connectionURI: "http://195.35.37.152:3567",
      // apiKey: <API_KEY(if configured)>,
    },
    appInfo,
    recipeList: [
      EmailPasswordNode.init({
        signUpFeature: {
          formFields: [
            {
              id: "company",
            },
            {
              id: "name",
            },
            {
              id: "username",
            },
            {
              id: "phone",
            },
          ],
        },
        override: {
          apis: (originalImplementation: any) => {
            return {
              ...originalImplementation,
              signUpPOST: async function (input) {
                if (originalImplementation.signUpPOST === undefined) {
                  throw Error("should never come here");
                }

                const response = await originalImplementation.signUpPOST(input);

                if (response.status === "OK") {
                  const formFields = input.formFields;

                  // TODO do validation for request payload
                  const filteredFields = formFields.filter(
                    (field) => field.id !== "password"
                  );
                  let payload = {};
                  for (const field of filteredFields) {
                    payload = {
                      ...payload,
                      [field.id]: field.value,
                    };
                  }

                  await graphqlRequest.request<any>(
                    insertOneUserMutation,
                    payload
                  );
                }

                return response;
              },
            };
          },
        },
      }),
      SessionNode.init(),
      Dashboard.init(),
      UserRoles.init(),
    ],
    isInServerlessEnv: true,
  };
};
