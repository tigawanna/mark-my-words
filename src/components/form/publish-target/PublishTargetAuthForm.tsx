import "@vscode-elements/elements/dist/vscode-icon";
import "@vscode-elements/elements/dist/vscode-table";
import "@vscode-elements/elements/dist/vscode-table-header";
import "@vscode-elements/elements/dist/vscode-table-header-cell";
import "@vscode-elements/elements/dist/vscode-table-body";
import "@vscode-elements/elements/dist/vscode-table-row";
import "@vscode-elements/elements/dist/vscode-table-cell";
import { PublishTargetBody } from "./PublishTargetBody";
import { PublishTargetHeaders } from "./PublishTargetHeaders";
import { usePublishTargetsStore } from "../../../store/targets-store";
import { PublishTargetEndpoint } from "./PublishTargetEndpoint";

interface PublishTargetAuthFormProps {}

export function PublishTargetAuthForm({}: PublishTargetAuthFormProps) {
  const { oneTarget, setOneTargetAuth } = usePublishTargetsStore();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full p-5 flex items-center justify-center">
        <PublishTargetEndpoint
          endpoint={{
            name: oneTarget?.auth?.name ?? "auth",
            endpoint: oneTarget?.auth?.endpoint ?? "https://example.com",
            method: oneTarget?.auth?.method ?? "POST",
          }}
          setEndpoint={(value) =>
            setOneTargetAuth({
              name: value?.auth?.name ?? "auth",
              endpoint: value?.auth?.endpoint ?? "https://example.com",
              method: value?.auth?.method ?? "POST",
            })
          }
        />
      </div>
      <div className="w-full h-full flex flex-col items-center justify-center  p-1 rounded-md">
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
          <vscode-tab-header slot="header">headers</vscode-tab-header>
          <vscode-tab-panel>
            <vscode-scrollable>
              <PublishTargetHeaders
                headers={oneTarget.headers}
                setFormHeaders={(value) =>
                  setOneTargetAuth({ ...oneTarget.auth?.headers, headers: value })
                }
              />
            </vscode-scrollable>
          </vscode-tab-panel>

          <vscode-tab-header slot="header">Body</vscode-tab-header>
          <vscode-tab-panel>
            <PublishTargetBody
              body_data={oneTarget.body}
              setFormBody={(value) => setOneTargetAuth({ ...oneTarget.auth?.body, body: value })}
            />
          </vscode-tab-panel>
        </vscode-tabs>
      </div>
      <div className="w-full p-5 flex items-center justify-center">
        <label className="w-full text-sm text-vscode-descriptionForeground">
          show where your request token is stored in the request and where to map it to in the
          headers{" "}
        </label>
        <input
          value={oneTarget.auth?.tokenMappedTo ?? "request.token,headers.Authorization"}
          placeholder="body. default request.token"
          onChange={(e) => setOneTargetAuth({ ...oneTarget.auth, tokenMappedTo: e.target.value })}
        />
      </div>
    </div>
  );
}
