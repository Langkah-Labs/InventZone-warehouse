import React from "react";
import Head from "next/head";
import getConfig from "next/config";
import { Props } from "./type";

const { publicRuntimeConfig } = getConfig();

const Seo = ({ title, description, url, keywords, children }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/dashboard/favicon.ico" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta
        property="og:image"
        content="/dashboard/assets/illustrations/logo-satset.png"
      />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="300" />
      <meta property="og:image:height" content="300" />
      <meta
        property="og:url"
        content={`${publicRuntimeConfig.appDomain}${url}`}
      />
      {publicRuntimeConfig.appDomain !== "https://satusehat.kemkes.go.id" ? (
        <meta name="robots" content="noindex" />
      ) : null}
      <meta name="twitter:card" content="summary_large_image" />

      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="SATUSEHAT developer portal" />
      <meta name="twitter:image:alt" content={title} />
      {children}
    </Head>
  </div>
);

export default Seo;
