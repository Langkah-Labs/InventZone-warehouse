import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import SuperTokenReact, { SuperTokensWrapper } from "supertokens-auth-react";

import { frontendConfig } from "@/config/frontendConfig";
import { ReactElement, ReactNode } from "react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

if (typeof window !== "undefined") {
  SuperTokenReact.init(frontendConfig());
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(
    <SuperTokensWrapper>
      <Component {...pageProps} />
    </SuperTokensWrapper>
  );
}
