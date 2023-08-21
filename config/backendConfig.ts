import EmailPasswordNode from "supertokens-node/recipe/emailpassword";
import SessionNode from "supertokens-node/recipe/session";
import Dashboard from "supertokens-node/recipe/dashboard";
import { appInfo } from "./appInfo";
import { TypeInput } from "supertokens-node/types";

export const backendConfig = (): TypeInput => {
  return {
    framework: "express",
    supertokens: {
      // https://try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
      connectionURI: "http://191.96.57.242:3567",
      // apiKey: <API_KEY(if configured)>,
    },
    appInfo,
    recipeList: [
      EmailPasswordNode.init({
        signUpFeature: {
          formFields: [
            {
              id: "team",
            },
            {
              id: "username",
            },
            {
              id: "phone",
            },
          ],
        },
      }),
      SessionNode.init(),
      Dashboard.init(),
    ],
    isInServerlessEnv: true,
  };
};
