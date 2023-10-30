import { Team } from "./team";

export type User = {
  id: string;
  name: string;
  role?: string;
  email: string;
  phone: string;
  username: string;
  team?: Team;
  company: string;
  serial_numbers_remaining?: number;
};
