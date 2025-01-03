export const createHttpResponse = (
  statusCode: number,
  statusMessage: string,
  headers: Record<string, string>,
  body: string
): string => {
  headers["Content-Length"] = Buffer.byteLength(body, "utf-8").toString();

  let response = `HTTP/1.1 ${statusCode} ${statusMessage}\r\n`;
  Object.entries(headers).forEach(([key, value]) => {
    response += `${key}: ${value}\r\n`;
  });
  response += `\r\n${body}`;
  return response;
};
