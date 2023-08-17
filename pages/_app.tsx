import "@/styles/globals.css";
import type { AppProps } from "next/app";
import SuperTokenReact, { SuperTokensWrapper } from "supertokens-auth-react";

import { frontendConfig } from "@/config/frontendConfig";

if (typeof window !== "undefined") {
  SuperTokenReact.init(frontendConfig());
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SuperTokensWrapper>
      <Component {...pageProps} />
    </SuperTokensWrapper>
  );
}
