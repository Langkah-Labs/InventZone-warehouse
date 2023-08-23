export type SerialNumberInput = {
  productOrderId: string;
  name: string;
  quantity: string;
};

export type SerialNumber = {
  id: string;
  productOrderId: string;
  name: string;
  quantity: string;
  createdAt: string;
  updatedAt: string;
};
