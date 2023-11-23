import axios from "axios";
import crypto from "crypto";

const axiosInstance = axios.create({
  baseURL: "http://timetableapi.ptv.vic.gov.au",
});

const request = async (url: string, params: Record<string, never>) => {
  const devId = process.env.DEV_ID;
  const apiKey = process.env.API_KEY;
  if (!devId || !apiKey) {
    throw new Error("DEV_ID or API_KEY not set");
  }
  // Url with params is a string like this: `?param1=value1&param2=value2` from the params object
  let urlWithParams = Object.entries(params).length
    ? `${url}?${Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")}`
    : url;

  urlWithParams = urlWithParams.includes("?")
    ? `${urlWithParams}&devid=${devId}`
    : `${urlWithParams}?devid=${devId}`;

  console.log(urlWithParams);

  const hashed = crypto.createHmac("sha1", apiKey);
  hashed.update(urlWithParams);

  const signature = hashed.digest("hex");

  const response = await axiosInstance.get(url, {
    params: { ...params, devid: devId, signature: signature.toUpperCase() },
  });
  return response.data;
};

export const getRoutes = async () => {
  try {
    const response = await request("/v3/routes", {});
    return response.routes;
  } catch (error) {
    console.log(error);
  }
};
