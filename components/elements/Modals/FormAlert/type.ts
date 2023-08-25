export interface Props {
  title?: string;
  description?: string;
  labelAction?: string;
  actionHandler: Function;
  rejectHandler: Function;
  labelReject?: string;
  show: any;
}
