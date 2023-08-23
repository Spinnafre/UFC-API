export interface HttpResponse<T = any> {
  status: number;
  body: T;
}
