import { getZoomIntegration } from "@/actions/zoom";
import { auth } from "../auth";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { refreshToken } from "./apis";
import { saveZoomCreds } from "@/db-utils/zoom";

function isTokenExpiring(token: string) {
  const decodedToken: any = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  // Check if the token expires in less than 5 minutes
  return decodedToken.exp - currentTime < 300;
}

axios.interceptors.request.use(async (config: any) => {
  const session = await auth();
  const zoomIntegration = await getZoomIntegration(
    session?.user?.email as string
  );
  if (!zoomIntegration) return config;

  let accessToken = zoomIntegration?.accessToken;
  // console.log("Access Token", accessToken)
  if (isTokenExpiring(accessToken)) {
    const tokenData = await refreshToken(
      zoomIntegration?.refreshToken as string
    );
    const { access_token, refresh_token } = tokenData;
    saveZoomCreds(access_token, refresh_token, session?.user?.email as string);
    accessToken = access_token;
    console.log("Refreshed Zoom Token");
  }
  config.headers["Authorization"] = `Bearer ${accessToken}`;
  return config;
});

/**
 * Generic function for making requests to the Zoom API
 * @param {string} method - Request method
 * @param {string | URL} endpoint - Zoom API Endpoint
 * @param {string} token - Access Token
 * @param {object} [data=null] - Request data
 */
export const makeZoomAPIRequest = async (
  method: string,
  endpoint: string,
  data: any
) => {
  const session = await auth();
  const zoomIntegration = await getZoomIntegration(
    session?.user?.email as string
  );
  if (!zoomIntegration) return false;

  try {
    const resp = await axios({
      method: method,
      url: "https://api.zoom.us/v2" + endpoint,
      data,
      headers: {
        // Authorization: "Bearer " + zoomIntegration?.accessToken,
        "Content-Type": "application/json",
      },
    });
    return resp.data;
  } catch (err) {
    console.error(method, endpoint);
    console.error("Error : ", err);
  }
};
