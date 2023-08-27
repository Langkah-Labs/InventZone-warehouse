import { NextApiRequest, NextApiResponse } from "next";
import { sendMail } from "@/config/mailer";
import Email from "@/emails";
import { graphqlRequest } from "@/utils/graphql";
import { minioClient } from "@/config/minio";
import { createObjectCsvWriter } from "csv-writer";
import dayjs from "dayjs";
import fs from "fs";

const findSerialNumberByIdQuery = `
  query FindSerialNumberById($id: bigint!) {
    serial_numbers_by_pk(id: $id) {
      generated_serial_numbers {
        code
        created_at
      }
    }
  }
`;

const insertSerialNumberMutation = `
  mutation InsertFileMutation($serialNumberId: bigint!, $url: String!) {
    insert_files_one(object: {serial_number_id: $serialNumberId, url: $url}) {
      id
      url
    }
  }
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { serialNumberId, to } = req.body;
    const host = req.headers.host || "";

    try {
      const result = await graphqlRequest.request<any>(
        findSerialNumberByIdQuery,
        {
          id: serialNumberId,
        }
      );
      const serialNumbers = result["serial_numbers_by_pk"][
        "generated_serial_numbers"
      ]?.map((serialNumber: any) => {
        return {
          ...serialNumber,
          created_at: dayjs(serialNumber.created_at).format("MMM D, YYYY"),
        };
      });

      const tempFilePath = `/tmp/serial_numbers_${to}.csv`;
      // generate csv file and save to minio
      const csvWriter = createObjectCsvWriter({
        path: tempFilePath,
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

      if (serialNumbers) {
        await csvWriter.writeRecords(serialNumbers);

        const minioBucket = process.env.MINIO_BUCKET_NAME || "";
        const filename = `serial_numbers_${to}_${dayjs().unix()}.csv`;
        const minioFilePath = `generated_serial_numbers/${filename}`;
        const uploadInfo = await minioClient.fPutObject(
          minioBucket,
          minioFilePath,
          tempFilePath
        );

        // store the file path to serial numbers table
        await graphqlRequest.request<any>(insertSerialNumberMutation, {
          serialNumberId,
          url: minioFilePath,
        });

        // delete file in tmp folder after successfully stored to minio
        if (fs.existsSync(tempFilePath)) {
          fs.unlink(tempFilePath, (err) => {
            if (err) {
              console.error(err);
              return;
            }

            console.log(`file ${tempFilePath} successfully deleted!`);
          });
        } else {
          console.log(`file ${tempFilePath} not found!`);
        }

        const fileUrl = `${host}/api/files/${minioFilePath}`;
        // send email to recipient using nodemailer
        await sendMail({
          to,
          subject: "Test send email",
          Template: Email,
          props: {
            fileUrl,
          },
        });

        res.status(200).json({
          status: "OK",
          message:
            "successfully send email with generated serial number to recipient",
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "failed to send email, serial numbers not found!",
        });
      }
    } catch (err) {
      console.error(err);
      res.status(422).json({
        status: "error",
        message: "failed to send email, please try again!",
      });
    }
  }
}
