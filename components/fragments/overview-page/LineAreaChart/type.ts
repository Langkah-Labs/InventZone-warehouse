export type SourceType = Array<Array<string | number>>;

export interface Props {
  source?: SourceType;
  xlabel?: string;
  yLabel?: string;
  isLoading?: boolean | undefined;
}
