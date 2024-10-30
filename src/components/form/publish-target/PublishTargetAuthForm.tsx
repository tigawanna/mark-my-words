import "@vscode-elements/elements/dist/vscode-icon";
import "@vscode-elements/elements/dist/vscode-table";
import "@vscode-elements/elements/dist/vscode-table-header";
import "@vscode-elements/elements/dist/vscode-table-header-cell";
import "@vscode-elements/elements/dist/vscode-table-body";
import "@vscode-elements/elements/dist/vscode-table-row";
import "@vscode-elements/elements/dist/vscode-table-cell";
import { PublishTargetBody } from "./PublishTargetBody";
import { PublishTargetHeaders } from "./PublishTargetHeaders";
import { usePublishTargetsStore, type PublishTarget } from "@/store/targets-store";
import { PublishTargetEndpoint } from "./PublishTargetEndpoint";
import { getNestedProperty } from "../../../utils/helpers";
import { PostTargetAuthVerification } from "./PostTargetAuthVerification";
import { getReturnedToken, addTokenToHeaders, testAuthEndpoint } from "./auth-api";

interface PublishTargetAuthFormProps {}

export function PublishTargetAuthForm({}: PublishTargetAuthFormProps) {
  const { oneTarget, setOneTargetAuth } = usePublishTargetsStore();
  const tokenResponse = getReturnedToken(oneTarget?.auth?.response);
  return (
    <div className="w-[95%] h-full  flex p-5 flex-col items-center justify-center">
      <div className="w-full h-full flex flex-col gap-1 ">
        <div className={""}>auth endpoint</div>
        <PublishTargetEndpoint
          endpoint={{
            baseUrl: oneTarget?.baseUrl ?? "https://example.com",
            name: oneTarget?.auth?.name ?? "auth",
            endpoint: oneTarget?.auth?.endpoint ?? "https://example.com",
            method: oneTarget?.auth?.method ?? "POST",
          }}
          setEndpoint={(value) => {
            setOneTargetAuth((prev) => ({
              ...prev,
              name: value?.name ?? "auth",
              endpoint: value?.endpoint ?? "/auth",
              method: value?.method ?? "POST",
            }));
          }}
        />
      </div>
      <div className="w-[98%] h-full flex flex-col items-center justify-center  p-1 rounded-md">
        <vscode-tabs selected-index={1} panel class="panel-example p-4 gap-3">
          <vscode-icon
            label="Maximize Panel Size"
            title="Maximize Panel Size"
            name="chevron-up"
            slot="addons"
            action-icon></vscode-icon>
          <vscode-icon
            label="Close Panel"
            title="Close Panel"
            name="close"
            slot="addons"
            action-icon></vscode-icon>
          <vscode-tab-header slot="header">auth headers</vscode-tab-header>
          <vscode-tab-panel>
            <vscode-scrollable>
              <div className="w-full h-full flex flex-col gap-1 ">
                <div className={""}>auth headers</div>
                <PublishTargetHeaders
                  headers={oneTarget.auth?.headers ?? {}}
                  setFormHeaders={(value) =>
                    setOneTargetAuth((prev) => ({ ...prev, headers:{
                      ...prev?.headers,
                      ...value
                    } }))
                  }
                  removeFormHeader={(value) =>
                    setOneTargetAuth((prev) => ({ ...prev, headers:{
                      ...value
                    } }))
                  }
                />
              </div>
            </vscode-scrollable>
          </vscode-tab-panel>

          <vscode-tab-header slot="header">auth body</vscode-tab-header>
          <vscode-tab-panel>
            <div className="w-full h-full flex flex-col gap-1 ">
              <div className={""}>auth body</div>
              <PublishTargetBody
                body_data={oneTarget.auth?.body ?? {}}
                setFormBody={(value) => setOneTargetAuth((prev) => ({ ...prev, body:{
                  ...prev?.body,
                  ...value
                } }))}
              />
            </div>
          </vscode-tab-panel>
          <vscode-tab-header slot="header">auth verification</vscode-tab-header>
          <vscode-tab-panel>
            <PostTargetAuthVerification oneTarget={oneTarget} setOneTargetAuth={setOneTargetAuth} />
          </vscode-tab-panel>
        </vscode-tabs>
      </div>
      <div className="w-[95%] p-5 flex flex-col items-center gap-3 justify-center">
        <label className="w-full text-sm text-vscode-descriptionForeground">
          show where your request token is stored in the auth respose and where to map it to in the
          headers{" "}
        </label>
        <input
          value={oneTarget.auth?.tokenMappedTo ?? "request.token,headers.Authorization"}
          placeholder="request.token,headers.Authorization"
          onChange={(e) =>
            setOneTargetAuth((prevAuth) => ({ ...prevAuth, tokenMappedTo: e.currentTarget.value }))
          }
        />
        {oneTarget.auth?.response && tokenResponse && (
          <div className="w-full flex flex-col  justify-center items-center ">
            <div className=" p-2 flex flex-col items-center  gap-1 text-sm ">
              <div className="text-sm ">token</div>
              <p className=" text-sm break-all text-vscode-descriptionForeground">
                {tokenResponse.responseToken}
              </p>
            </div>
            {
              <div className="w-full p-2 flex flex-col items-center  gap-1 text-sm ">
                <button
                  disabled={!oneTarget.auth?.response}
                  className="sm:w-[45%]"
                  onClick={() => addTokenToHeaders(oneTarget.auth?.response)}>
                  Add to headers
                </button>
                <button
                  disabled={!oneTarget.auth?.response}
                  className="sm:w-[45%]"
                  onClick={() => addTokenToHeaders(oneTarget.auth?.response)}>
                  Add to headers
                </button>
              </div>
            }
          </div>
        )}
        <button className="lg:w-[45%]" onClick={() => testAuthEndpoint(oneTarget)}>
          test auth endpoint
        </button>
      </div>
    </div>
  );
}

