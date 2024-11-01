import { useOnePublishTargetsStore, OnePublishTarget } from "@/store/one-publish-targets-store";
import { PublishForm } from "@/store/publish-form-store";
import { getNestedProperty, mapFieldsToValues } from "@/utils/helpers";
import { postInformMessages } from "@/utils/post-messages";

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
    body:method==="GET"?undefined: JSON.stringify(body),
  }).then((res) => {
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res.json();
  });
}

export function addTokenToHeaders(authResponse?: Record<string, string>) {
  if (!authResponse) {return;}
  const updateHeaders = useOnePublishTargetsStore.getState().setOneTarget;
  const tokenRespose = getReturnedToken(authResponse);
  if (!tokenRespose) {return;}
  const { addTokenTo, responseToken } = tokenRespose;
  const tokenkey = addTokenTo.split(".")[1];
  updateHeaders((prevTarget) => ({
    ...prevTarget,
    headers: {
      ...prevTarget.headers,
      [tokenkey]: responseToken,
    },
    auth:{
      ...prevTarget.auth,
      verification:{
        ...prevTarget.auth?.verification,
        headers: {
          ...prevTarget.auth?.verification?.headers,
          [tokenkey]: responseToken
        }
      }
    }
  }));
}
export function getReturnedToken(authResponse?: Record<string, string>) {
  if (!authResponse) {return;}
  const tokenLocation = useOnePublishTargetsStore.getState().oneTarget.auth?.tokenMappedTo;
  if (!tokenLocation) {return;}
  // sample token location is mapped as such "request.token,headers.Authorization"
  const tokenLocations = tokenLocation.split(",");
  const requestTokenPart = tokenLocations[0].split(".");
  const responseToken = getNestedProperty(authResponse, requestTokenPart[1]);
  if (!responseToken) {return;}
  if (typeof responseToken === "string" && responseToken.length > 1) {
    return { responseToken, addTokenTo: tokenLocations[1] };
  }
}

export async function testAuthEndpoint(oneTarget: OnePublishTarget) {
  try {
    const updateAuth = useOnePublishTargetsStore.getState().setOneTargetAuth;
    if (!oneTarget?.auth || !oneTarget?.auth?.endpoint) {
      throw new Error("no auth object");
    }
    console.log(" === testAuthEndpoint ===", oneTarget?.auth);
    const { endpoint, headers, body, method } = oneTarget?.auth;
    const authResponse = await fetchWrapper({ endpoint, headers, body, method });
    updateAuth((prevAuth) => ({ ...prevAuth, response: authResponse }));
    postInformMessages({ message:"Authentication success", type:"info" });
    return authResponse;
  } catch (error: any) {
    console.log(" === testAuthEndpoint error ===", error);
    postInformMessages({ message:"Authentication failed", type:"error" });
  }
}
export async function testAuthVerificationEndpoint(oneTarget: OnePublishTarget) {
  try {
    const updateAuth = useOnePublishTargetsStore.getState().setOneTargetAuth;
    if (!oneTarget?.auth?.verification || !oneTarget?.auth?.verification?.endpoint) {
      throw new Error("no auth verification object");
    }
    const { endpoint, headers, body, method } = oneTarget?.auth?.verification;
    const authResponse = await fetchWrapper({ endpoint, headers, body, method });
    updateAuth((prevAuth) => ({ ...prevAuth,verification:{
      ...prevAuth?.verification,
      response: authResponse
    } }));
    postInformMessages({ message:"Authentication verification success", type:"info" });
    return authResponse;
  } catch (error: any) {
    console.log(" === testAuthVerificationEndpoint error ===", error.message);
    postInformMessages({ message:"Authentication verification failed", type:"error" });
  }
}

export async function doPublish(formdata: PublishForm,oneTarget: OnePublishTarget) {
  try {
    const { endpoint, headers, body, method } = mapFieldsToValues(formdata, oneTarget);
    const authResponse = await fetchWrapper({ endpoint, headers, body, method });
    postInformMessages({ message:"Publish success", type:"info" });
    return authResponse;
  } catch (error: any) {
    console.log(" === doPublish error ===", error.message);
    postInformMessages({ message:"Publish failed", type:"error" });
  }
}


