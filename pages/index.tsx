import SidebarLayout from "@/components/elements/SideBarLayout";
import Overview from "@/components/fragments/overview-page";
import { Raleway } from "next/font/google";
import { ReactElement } from "react";
import type { NextPageWithLayout } from "./_app";
import Session from "supertokens-node/recipe/session";
import supertokensNode from "supertokens-node";
import { backendConfig } from "../config/backendConfig";

const raleway = Raleway({ subsets: ["latin"] });

export async function getServerSideProps(context: any) {
  supertokensNode.init(backendConfig());

  let session;

  try {
    session = await Session.getSession(context.req, context.res, {
      overrideGlobalClaimValidators: () => {
        return [];
      },
    });
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

  return {
    props: { userId: session!.getUserId() },
  };
}

const Home: NextPageWithLayout = () => {
  return (
    <main className={`${raleway.className}`}>
      <Overview />
    </main>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default Home;
