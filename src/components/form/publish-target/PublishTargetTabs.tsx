import "@vscode-elements/elements/dist/vscode-icon";
import "@vscode-elements/elements/dist/vscode-tabs";
import "@vscode-elements/elements/dist/vscode-tab-header";
import "@vscode-elements/elements/dist/vscode-tab-panel";
import "@vscode-elements/elements/dist/vscode-scrollable";
import "@vscode-elements/elements/dist/vscode-badge";
import { PublishTargetHeaders } from "./PublishTargetHeaders.tsx";
import { PublishTargetBody } from "./PublishTargetBody.tsx";
import { PublishTargetAuthForm } from "./PublishTargetAuthForm.tsx";
import { useOnePublishTargetsStore } from "@/store/one-publish-targets-store.ts";
import { PublishTargetMappings } from "./PublishTargetMappings.tsx";

interface PublishTargetFormTabsProps {}
// scured tab
export function PublishTargetFormTabs({}: PublishTargetFormTabsProps) {
  const { oneTarget, setOneTarget } = useOnePublishTargetsStore();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-5  rounded-md">
      <vscode-tabs selected-index={2} panel class="panel-example  gap-3">
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
              setFormHeaders={(value) => {
                console.log("=== new headers === ", value);
                setOneTarget((prev) => ({
                  ...prev,
                  headers: {
                    ...value,
                  },
                }));
              }}
              removeFormHeader={(value) =>
                setOneTarget((prev) => ({
                  ...prev,
                  headers: {
                    ...value,
                  },
                }))
              }
            />
          </vscode-scrollable>
        </vscode-tab-panel>

        <vscode-tab-header slot="header">Body</vscode-tab-header>
        <vscode-tab-panel class="w-full">
          <PublishTargetBody
            body_data={oneTarget.body}
            setFormBody={(value) =>
              setOneTarget((prev) => ({
                ...prev,
                body: {
                  ...value,
                },
              }))
            }
          />
        </vscode-tab-panel>
        <vscode-tab-header slot="header">auth</vscode-tab-header>
        <vscode-tab-panel>
          <vscode-scrollable>
            <PublishTargetAuthForm />
          </vscode-scrollable>
        </vscode-tab-panel>
        <vscode-tab-header slot="header">Mappings</vscode-tab-header>
        <vscode-tab-panel class="w-full">
          <PublishTargetMappings
            mappings={oneTarget.mappings}
            setFormMappings={(value) => {
              setOneTarget((prev) => ({
                ...prev,
                mappings: {
                  ...value,
                },
              }));
            }}
          />
        </vscode-tab-panel>
      </vscode-tabs>
    </div>
  );
}
