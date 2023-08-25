import { Button } from "@react-email/button";
import { Html } from "@react-email/html";
import * as React from "react";

type Props = {
  fileUrl: string;
};

// TODO: modify email template
export default function Email({ fileUrl }: Props) {
  return (
    <Html>
      <Button
        pX={20}
        pY={12}
        href={fileUrl}
        style={{ background: "#000", color: "#fff" }}
      >
        Click to Download
      </Button>
    </Html>
  );
}
