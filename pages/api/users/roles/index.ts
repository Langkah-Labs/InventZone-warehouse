import { NextApiResponse, NextApiRequest } from "next";
import UserRoles from "supertokens-node/recipe/userroles";
import supertokensNode from "supertokens-node";
import { backendConfig } from "@/config/backendConfig";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  supertokensNode.init(backendConfig());

  switch (req.method) {
    case "POST":
      POST(req, res);
      break;
    default:
      console.error("[api/users/role] request method not supported!");
      break;
  }
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { role, permissions } = req.body;

  try {
    const response = await UserRoles.createNewRoleOrAddPermissions(
      role,
      permissions
    );

    res.status(200).json(response);
  } catch (err) {
    console.error(err);

    res.status(422).json({
      status: "error",
      message: "can't create role, please try again!",
      createdNewRole: false,
    });
  }
}