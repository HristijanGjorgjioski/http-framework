import { HttpMethod, Request } from "../types/index";

export const parseHttpRequest = (data: string): Request => {
  const [headerPart, body] = data.split("\r\n\r\n");
  const [requestLine, ...headerLines] = headerPart.split("\r\n");

  const [method, fullPath] = requestLine.split(" ");
  const [path, queryString] = fullPath.split("?");

  const headers = new Headers();
  headerLines.forEach((line) => {
    const [key, value] = line.split(": ");
    headers.append(key.toLowerCase(), value);
  });

  const query: Record<string, string> = queryString
    ? Object.fromEntries(new URLSearchParams(queryString))
    : {};

  return {
    method: method as HttpMethod,
    path,
    headers,
    body: body || "",
    parsedBody: body.toString() || "",
    query,
  };
};
