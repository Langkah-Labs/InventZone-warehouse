import EmailPasswordWebJs from "supertokens-web-js/recipe/emailpassword";
import SessionWebJs from "supertokens-web-js/recipe/session";
import { appInfo } from "./appInfo";

export const frontendConfig = () => {
  return {
    appInfo,
    recipeList: [EmailPasswordWebJs.init(), SessionWebJs.init()],
  };
};
