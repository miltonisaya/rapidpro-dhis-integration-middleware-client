import {Flow} from "./Flow";

export interface FlowApiResponse {
  data: Flow[];
  page: number;
  size: number;
  status: number;
  total: number;
}
