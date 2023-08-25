import { NextApiRequest, NextApiResponse } from "next";
import { sendMail } from "@/config/mailer";
import Email from "@/emails";
import { graphqlRequest } from "@/utils/graphql";

const findFilesBySerialNumberIdQuery = `
  query FindFilesBySerialNumberId($serialNumberId: bigint!) {
    files(where: {serial_number_id: {_eq: $serialNumberId}}, order_by: {created_at: desc}, limit: 1) {
      id
      url
      created_at
      updated_at
    }
  }
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { serialNumberId, to } = req.body;

  if (req.method === "POST") {
    // find serial number by id
    const result = await graphqlRequest.request<any>(
      findFilesBySerialNumberIdQuery,
      {
        serialNumberId,
      }
    );
    // get file url from the serial_numbers table
    const fileUrl = result["files"][0]["url"];
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
  }
}
