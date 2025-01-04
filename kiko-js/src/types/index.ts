export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export type Request = {
  method: HttpMethod;
  path: string;
  headers: Headers;
  body: string;
  query: Record<string, string>;
};

export type Response = {
  send: (body: string) => void;
  status: (code: number) => { json: (body: any) => void };
};

export type Handler = (req: Request, res: Response) => void;
