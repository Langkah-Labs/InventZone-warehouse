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
  product: {
    name: string;
    shorten_name: string;
  };
};
