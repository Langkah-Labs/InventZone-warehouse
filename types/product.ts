export type ProductInput = {
  name: string;
  description: string;
  shorten_name: string;
};

export type Product = {
  id: string;
  name: string;
  shorten_name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};
