import "@vscode-elements/elements/dist/vscode-icon";
import "@vscode-elements/elements/dist/vscode-tabs";
import "@vscode-elements/elements/dist/vscode-tab-header";
import "@vscode-elements/elements/dist/vscode-tab-panel";
import "@vscode-elements/elements/dist/vscode-scrollable";
import "@vscode-elements/elements/dist/vscode-badge";
import type { PostTarget } from "../../../extension/utils/config-manager.ts.ts";
import { PublicationSettingsFormHeaders } from "./PublicationSettingsFormHeaders.tsx";
import { PublicationSettingsFormBody } from "./PublicationSettingsFormBody.tsx";

interface PublishFormSettingsTabsProps {
  formData: PostTarget & { editing: boolean };
  setFormData: (
    value: React.SetStateAction<
      PostTarget & {
        editing: boolean;
      }
    >
  ) => void;
}
// scured tab
export function PublishFormSettingsTabs({ formData, setFormData }: PublishFormSettingsTabsProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center  p-1 rounded-md">
      <vscode-tabs selected-index={2} panel class="panel-example p-4 gap-3">
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
            <PublicationSettingsFormHeaders headers={formData.headers} setFormData={setFormData} />
          </vscode-scrollable>
        </vscode-tab-panel>

        <vscode-tab-header slot="header">Body</vscode-tab-header>
        <vscode-tab-panel>
          <PublicationSettingsFormBody body_data={formData.body} setFormData={setFormData} />
        </vscode-tab-panel>
      </vscode-tabs>
    </div>
  );
}
