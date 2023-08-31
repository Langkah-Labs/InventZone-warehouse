import { Button } from "@react-email/button";
import { Html } from "@react-email/html";
import { Text } from "@react-email/text";
import { Link } from "@react-email/link";
import * as React from "react";

type Props = {
  fileUrl: string;
};

// TODO: modify email template
export default function Email({ fileUrl }: Props) {
  return (
    <Html>
      <Text>You can download the generated serial number below</Text>
      <Button
        pX={20}
        pY={12}
        href={fileUrl}
        style={{ background: "#000", color: "#fff", cursor: "pointer" }}
      >
        Click to Download
      </Button>
      <Text>
        or click this{" "}
        <a href={fileUrl} target="_blank">
          link
        </a>{" "}
        if the button above doesn&apos;t work
      </Text>
    </Html>
  );
}
