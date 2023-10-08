import { minioClient } from "@/config/minio";
import { NextApiRequest, NextApiResponse } from "next";
import multiparty from "multiparty";

declare module "next" {
  interface NextApiRequest {
    files: any;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const form = new multiparty.Form();

    form.parse(req, function (err, fields, files) {
      if (err) {
        console.error(err);
      }

      req.body = fields;
      req.files = files;
    });

    const filename = "";
    const minioBucket = process.env.MINIO_BUCKET_NAME || "";

    try {
      await minioClient.fPutObject(minioBucket, filename, filename);

      res.status(200).json({
        status: "success",
        message: "successfully upload a file",
        data: {
          filename,
        },
      });
    } catch (err) {
      console.error(err);

      res.status(422).json({
        status: "error",
        message: "failed to upload a file",
      });
    }
  }
}
