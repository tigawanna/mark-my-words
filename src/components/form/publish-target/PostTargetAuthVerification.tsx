import { PublishTarget } from "@/store/targets-store";
import { PublishTargetBody } from "./PublishTargetBody";
import { PublishTargetHeaders } from "./PublishTargetHeaders";
import { PublishTargetEndpoint } from "./PublishTargetEndpoint";
import { testAuthVerificationEndpoint } from "./auth-api";

interface PostTargetAuthVerificationProps {
  oneTarget: PublishTarget;
  setOneTargetAuth: (value: (prevState: PublishTarget["auth"]) => PublishTarget["auth"]) => void;
}

export function PostTargetAuthVerification({
  oneTarget,
  setOneTargetAuth,
}: PostTargetAuthVerificationProps) {
  const defaultVerification = {
    name: oneTarget?.auth?.verification?.name ?? "auth verification",
    body: oneTarget?.auth?.verification?.body ?? {},
    endpoint: oneTarget?.auth?.verification?.endpoint ?? "https://example.com",
    headers: oneTarget?.auth?.verification?.headers ?? {
      Authorization: "",
    },
    method: oneTarget?.auth?.verification?.method ?? "POST",
    response: oneTarget?.auth?.verification?.response ?? {},
  };
  return (
    <div className="w-full h-full flex bg-vscode-widget-shadow flex-col gap-2 p-5  rounded-lg items-center justify-center">
      <div className="w-full h-full flex flex-col gap-1 ">
        <div className={""}>verification endpoint</div>
        <PublishTargetEndpoint
          endpoint={{
            baseUrl: oneTarget?.baseUrl ?? "https://example.com",
            name: oneTarget?.auth?.verification?.name ?? "auth",
            endpoint: oneTarget?.auth?.verification?.endpoint ?? "https://example.com",
            method: oneTarget?.auth?.verification?.method ?? "POST",
          }}
          setEndpoint={(value) => {
            setOneTargetAuth((prevAuth) => ({
              ...prevAuth,
              verification: {
                ...prevAuth?.verification,
                name: value?.name ?? "",
                endpoint: value?.endpoint ?? "",
                method: value?.method ?? "POST",
              },
            }));
          }}
        />
      </div>

      <div className="w-full h-full flex flex-col gap-1 p-3">
        <div className={""}>verification headers</div>
        <PublishTargetHeaders
          headers={oneTarget.auth?.verification?.headers ?? {}}
          setFormHeaders={(value) =>
            setOneTargetAuth((prevAuth) => ({
              ...prevAuth,
              verification: {
                ...defaultVerification,
                headers: {
                  ...prevAuth?.verification?.headers,
                  ...value,
                },
              },
            }))
          }
          removeFormHeader={(value) =>
            setOneTargetAuth((prevAuth) => ({
              ...prevAuth,
              verification: {
                ...defaultVerification,
                headers: {
                  ...value,
                },
              },
            }))
          }
        />
      </div>

      <div className="w-full h-full flex flex-col gap-1 p-3">
        <div className={""}>verification body</div>
        <PublishTargetBody
          body_data={oneTarget.auth?.verification?.body ?? {}}
          setFormBody={(value) =>
            setOneTargetAuth((prevAuth) => ({
              ...prevAuth,
              verification: {
                ...prevAuth?.verification,
                body: {
                  ...prevAuth?.verification?.body,
                  ...value,
                },
              },
            }))
          }
        />
      </div>
      <button className={"w-[40%]"} onClick={() => testAuthVerificationEndpoint(oneTarget)}>Test Auth Verification</button>
    </div>
  );
}


