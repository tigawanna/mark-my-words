import "@vscode-elements/elements/dist/vscode-icon";
import "@vscode-elements/elements/dist/vscode-table";
import "@vscode-elements/elements/dist/vscode-table-header";
import "@vscode-elements/elements/dist/vscode-table-header-cell";
import "@vscode-elements/elements/dist/vscode-table-body";
import "@vscode-elements/elements/dist/vscode-table-row";
import "@vscode-elements/elements/dist/vscode-table-cell";
import type { PostTarget } from "../../extension/utils/config-manager.ts.ts";
import { vscode } from "../utils/vscode.ts";

interface PublicationSettingsTableProps {
  targets: PostTarget[];
  setTargets: React.Dispatch<React.SetStateAction<PostTarget[]>>;
  setFormData: React.Dispatch<React.SetStateAction<PostTarget & { editing: boolean }>>;
}

export function PublicationSettingsTable({ targets, setFormData }: PublicationSettingsTableProps) {
  const handleDeleteTarget = (id: string) => {
    vscode.postMessage({
      type: "deleteTarget",
      data: id,
    });
  };

  return (
    <div className="flex min-w-[60%] flex-col  justify-center items-center gap-2">
      <h2 className="text-lg">Configured Targets</h2>

      {targets.length === 0 ? (
        <p className="empty-message">No targets configured yet</p>
      ) : (
        <div className="border border-vscode-editorGroup-dropBackground">
          <vscode-table
            class="responsive-example zebra bordered-row"
            bordered-columns
            zebra
            responsive
            breakpoint="200">
            <vscode-table-header slot="header">
              <vscode-table-header-cell>method</vscode-table-header-cell>
              <vscode-table-header-cell>name</vscode-table-header-cell>
              <vscode-table-header-cell>url</vscode-table-header-cell>
            </vscode-table-header>
            <vscode-table-body slot="body">
              {targets.map((target, index) => (
                <vscode-table-row
                  key={target.name + target.method + index}
                  class="cursor-pointer   hover:brightness-150 p-1">
                  <vscode-table-cell class="p-2 ">{target.method}</vscode-table-cell>
                  <vscode-table-cell class="p-2">{target.name}</vscode-table-cell>
                  <vscode-table-cell class="p-2">
                    <div className="flex w-full items-center justify-between">
                      <div className="flex w-full items-center overflow-clip">
                        {target.endpoint}{" "}
                      </div>
                      <div className="flex gap-1 items-center p-1">
                        <vscode-icon
                          name="edit"
                          class="hover:text-vscode-focusBorder hover:outline p-1 hover:outline-vscode-focusBorder"
                          onClick={() => {
                            setFormData(() => {
                              return { ...target, editing: true };
                            });
                          }}></vscode-icon>
                        <vscode-icon
                          name="chrome-close"
                          class="hover:text-vscode-errorForeground hover:outline p-1 hover:outline-vscode-errorForeground"
                          onClick={() => {
                            handleDeleteTarget(target.id);
                          }}></vscode-icon>
                      </div>
                    </div>
                  </vscode-table-cell>
                </vscode-table-row>
              ))}
              <vscode-table-row></vscode-table-row>
            </vscode-table-body>
          </vscode-table>
        </div>
      )}
    </div>
  );
}
