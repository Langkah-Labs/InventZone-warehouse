interface valuesType {
  label: string;
  value: string | number;
}

export interface Props {
  id?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  listValues?: Array<valuesType>;
  isRequired?: boolean;
}
