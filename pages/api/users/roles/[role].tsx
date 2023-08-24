import { NextApiResponse, NextApiRequest } from "next";
import UserRoles from "supertokens-node/recipe/userroles";
import supertokensNode from "supertokens-node";
import { backendConfig } from "@/config/backendConfig";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  supertokensNode.init(backendConfig());

  switch (req.method) {
    case "DELETE":
      DELETE(req, res);
      break;
    default:
      console.error("[api/users/role] request method not supported!");
      break;
  }
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { role } = req.query;

  try {
    const result = await UserRoles.deleteRole(role as string);
    if (result.status !== "OK" || result.didRoleExist === false)
      res.status(404).json({
        status: "error",
        message: "failed to delete role, the role didn't exists",
        didRoleExist: result.didRoleExist,
      });

    res.status(200).json({
      status: "success",
      didRoleExist: result.didRoleExist,
    });
  } catch (err) {
    console.error(err);

    res.status(422).json({
      status: "error",
      message: "failed to delete role, please try again!",
      didRoleExist: false,
    });
  }
}
