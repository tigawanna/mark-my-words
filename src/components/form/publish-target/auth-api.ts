import { usePublishTargetsStore, PublishTarget } from "@/store/targets-store";
import { vscode } from "@/utils";
import { getNestedProperty } from "@/utils/helpers";

interface IAuthWrapperProps {
  endpoint: string;
  headers?: Record<string, string>;
  body?: Record<string, string>;
  method?: string;
}

export async function fetchWrapper({ endpoint, headers, body, method }: IAuthWrapperProps) {
  return await fetch(endpoint, {
    method,
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  }).then((res) => {
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res.json();
  });
}

export function addTokenToHeaders(authResponse?: Record<string, string>) {
  if (!authResponse) return;
  const updateHeaders = usePublishTargetsStore.getState().setOneTarget;
  const tokenRespose = getReturnedToken(authResponse);
  if (!tokenRespose) return;
  const { addTokenTo, responseToken } = tokenRespose;
  const tokenkey = addTokenTo.split(".")[1];
  updateHeaders((prevTarget) => ({
    ...prevTarget,
    headers: {
      ...prevTarget.headers,
      [tokenkey]: responseToken,
    },
  }));
}
export function getReturnedToken(authResponse?: Record<string, string>) {
  if (!authResponse) return;
  const tokenLocation = usePublishTargetsStore.getState().oneTarget.auth?.tokenMappedTo;
  if (!tokenLocation) return;
  // sample token location is mapped as such "request.token,headers.Authorization"
  const tokenLocations = tokenLocation.split(",");
  const requestTokenPart = tokenLocations[0].split(".");
  const responseToken = getNestedProperty(authResponse, requestTokenPart[1]);
  if (!responseToken) return;
  if (typeof responseToken === "string" && responseToken.length > 1) {
    return { responseToken, addTokenTo: tokenLocations[1] };
  }
}

export async function testAuthEndpoint(oneTarget: PublishTarget) {
  try {
    const updateAuth = usePublishTargetsStore.getState().setOneTargetAuth;
    if (!oneTarget?.auth || !oneTarget?.auth?.endpoint) {
      throw new Error("no auth object");
    }
    const { endpoint, headers, body, method } = oneTarget?.auth;
    const authResponse = await fetchWrapper({ endpoint, headers, body, method });
    updateAuth((prevAuth) => ({ ...prevAuth, response: authResponse }));
    return authResponse;
  } catch (error: any) {
    console.error(" === testAuthEndpoint error ===", error.message);
  }
}
export async function testAuthVerificationEndpoint(oneTarget: PublishTarget) {
  try {
    const updateAuth = usePublishTargetsStore.getState().setOneTargetAuth;
    if (!oneTarget?.auth?.verification || !oneTarget?.auth?.verification?.endpoint) {
      throw new Error("no auth verification object");
    }
    const { endpoint, headers, body, method } = oneTarget?.auth?.verification;
    const authResponse = await fetchWrapper({ endpoint, headers, body, method });
    updateAuth((prevAuth) => ({ ...prevAuth,verification:{
      ...prevAuth?.verification,
      response: authResponse
    } }));
    vscode.postMessage({
      type:"inform",
      data:{
        type:"info",
        message:"Authentication verification success"
      }
    })
    return authResponse;
  } catch (error: any) {
    console.error(" === testAuthVerificationEndpoint error ===", error.message);
  }
}
