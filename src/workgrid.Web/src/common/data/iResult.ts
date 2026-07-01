
export interface IResult<T = any> {
  succeeded: boolean;
  message: string;
  errors: string[];
  data: T | null;
}