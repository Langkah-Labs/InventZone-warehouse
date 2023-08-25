import { NextApiRequest, NextApiResponse } from "next";
import { createObjectCsvWriter } from "csv-writer";
import { minioClient } from "@/config/minio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { filename, serialNumbers } = req.body;

  const csvWriter = createObjectCsvWriter({
    path: filename,
    header: [
      {
        id: "code",
        title: "Serial Number",
      },
      {
        id: "created_at",
        title: "Created at",
      },
    ],
  });

  const minioBucket = process.env.MINIO_BUCKET_NAME || "";

  try {
    await csvWriter.writeRecords(serialNumbers);

    await minioClient.fPutObject(minioBucket, filename, filename);
  } catch (err) {
    console.error(err);
  }

  res.status(200).json({});
}
