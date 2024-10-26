import "@vscode-elements/elements/dist/vscode-icon";
import "@vscode-elements/elements/dist/vscode-tabs";
import "@vscode-elements/elements/dist/vscode-tab-header";
import "@vscode-elements/elements/dist/vscode-tab-panel";
import "@vscode-elements/elements/dist/vscode-scrollable";
import "@vscode-elements/elements/dist/vscode-badge";

import { usePublishTargetsStore } from "../../../store/targets-store.ts";
import { PublishTargetHeaders } from "./PublishTargetHeaders.tsx";
import { PublishTargetBody } from "./PublishTargetBody.tsx";

interface PublishTargetFormTabsProps {

}
// scured tab
export function PublishTargetFormTabs({  }: PublishTargetFormTabsProps) {
     const { one_target, setOneTarget } = usePublishTargetsStore();
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
            <PublishTargetHeaders headers={one_target.headers} setFormData={setOneTarget} />
          </vscode-scrollable>
        </vscode-tab-panel>

        <vscode-tab-header slot="header">Body</vscode-tab-header>
        <vscode-tab-panel>
          <PublishTargetBody body_data={one_target.body} setFormData={setOneTarget} />
        </vscode-tab-panel>
      </vscode-tabs>
    </div>
  );
}
