import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { middleware } from "supertokens-node/framework/express";
import { NextApiRequest, NextApiResponse } from "next";
import { Request, Response } from "express";
import supertokens from "supertokens-node";
import { backendConfig } from "../../../config/backendConfig";
import NextCors from "nextjs-cors";

supertokens.init(backendConfig());

export default async function superTokens(
  req: NextApiRequest & Request,
  res: NextApiResponse & Response
) {
  // NOTE: We need CORS only if we are querying the APIs from a different origin
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: [
      "http://localhost",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://191.96.57.242:8085",
      "http://191.96.57.242:8086",
      "http://191.96.57.242:8087",
      "http://195.35.37.152",
      "http://195.35.37.152:8085",
      "http://195.35.37.152:8086",
      "http://195.35.37.152:8087",
      "https://dashboard.kadaka.id",
      "https://vendor.kadaka.id",
      "https://report.kadaka.id",
    ],
    credentials: true,
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
  });

  await superTokensNextWrapper(
    async (next) => {
      // This is needed for production deployments with Vercel
      res.setHeader(
        "Cache-Control",
        "no-cache, no-store, max-age=0, must-revalidate"
      );
      await middleware()(req, res, next);
    },
    req,
    res
  );
  if (!res.writableEnded) {
    res.status(404).send("Not found");
  }
}
