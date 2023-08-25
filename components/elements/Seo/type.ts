import { ReactNode } from "react";

export interface Props {
  title: string;
  url?: string;
  icon?: string;
  description?: string;
  keywords?: string;
  children?: ReactNode;
}
