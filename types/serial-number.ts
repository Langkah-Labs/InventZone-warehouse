export type SerialNumberInput = {
  productOrderId: string;
  product_id: number;
  name: string;
  quantity: string;
};

export type SerialNumber = {
  id: string;
  product_order_id: string;
  product_id: number;
  name: string;
  quantity: string;
  createdAt: string;
  updatedAt: string;
  status: Boolean;
  verification: Boolean;
  product: {
    name: string;
    shorten_name: string;
  };
};

export type GeneratedSerialNumber = {
  id: string;
  serial_number_id: string;
  code: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};
