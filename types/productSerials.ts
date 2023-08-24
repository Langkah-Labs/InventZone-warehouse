export type ProductSerialsInput = {
  serial_number: string;
  product_id: number;
  capacity: number;
  optical_power: string;
  description: string;
};

export type ProductSerials = {
  capacity: number;
  id: number;
  product_id: number;
  optical_power: string;
  serial_number: string;
  description: string;
  created_at: string;
  updated_at: string;
  product: {
    name: string;
    shorten_name: string;
  };
};
