import { minioClient } from "@/config/minio";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { path } = req.query;

    let fullPath = "";
    if (Array.isArray(path)) {
      fullPath = path?.join("/");
    }

    const minioBucket = process.env.MINIO_BUCKET_NAME || "";
    const fileStream = await minioClient.getObject(minioBucket, fullPath);

    fileStream.on("error", (err) => {
      console.error(err);

      res.status(404).json({
        status: "error",
        message: "file not found",
      });
    });

    res.setHeader("Content-disposition", `attachment; filename="${fullPath}"`);
    res.setHeader("Content-type", "application/octet-stream");

    fileStream.pipe(res);
  }
}
