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
  body: string | Record<string, string>;
  parsedBody: string;
  query: Record<string, string>;
};

export type Response = {
  send: (body: string | Record<string, string>) => void;
  status: (code: number) => { json: (body: any) => void };
};

export type Handler = (req: Request, res: Response) => void;
