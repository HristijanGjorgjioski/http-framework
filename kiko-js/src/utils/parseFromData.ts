export const parseFormData = (body: string): Record<string, string> => {
  const parsedData: Record<string, string> = {};

  const pairs = body.split("&");

  pairs.forEach((pair) => {
    const [key, value] = pair.split("=");

    const decodedKey = decodeURIComponent(key);
    const decodedValue = decodeURIComponent(value);

    parsedData[decodedKey] = decodedValue;
  });

  return parsedData;
};
