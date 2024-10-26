import "@vscode-elements/elements/dist/vscode-icon";
import "@vscode-elements/elements/dist/vscode-table";
import "@vscode-elements/elements/dist/vscode-table-header";
import "@vscode-elements/elements/dist/vscode-table-header-cell";
import "@vscode-elements/elements/dist/vscode-table-body";
import "@vscode-elements/elements/dist/vscode-table-row";
import "@vscode-elements/elements/dist/vscode-table-cell";
import type { PostTarget } from "../../../extension/utils/config-manager.ts.ts";
import { useState } from "react";
interface PublicationSettingsFormBodyProps {
  body_data: Record<string, string>;
  setFormData: (
    value: React.SetStateAction<
      PostTarget & {
        editing: boolean;
      }
    >
  ) => void;
}

export function PublicationSettingsFormBody({
  body_data,
  setFormData,
}: PublicationSettingsFormBodyProps) {
  const [editing, setEditing] = useState(false);
  const [keyValue, setKeyValue] = useState<{ key: string; value: string }>({
    key: "",
    value: "",
  });
  const handleAddBodyItem = (body: { key: string; value: string }) => {
    setFormData((prev) => {
      return {
        ...prev,
        body: {
          ...prev.body,
          [body.key]: body.value,
        },
      };
    });
    setKeyValue({
      key: "",
      value: "",
    });
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 w-full">
        <input
          type="text"
          placeholder="Body Key"
          value={keyValue.key}
          onChange={(e) =>
            setKeyValue((prev) => {
              return {
                ...prev,
                key: e.target.value,
              };
            })
          }
          className=""
        />
        <input
          type="text"
          placeholder="Body Value"
          value={keyValue.value}
          onChange={(e) =>
            setKeyValue((prev) => {
              return {
                ...prev,
                value: e.target.value,
              };
            })
          }
          className=""
        />
        <button type="button" onClick={() => handleAddBodyItem(keyValue)} className="w-fit min-w-[10%]">
          Add
        </button>
      </div>

{body_data&&      <vscode-table
        class="responsive-example zebra bordered-row"
        bordered-columns
        zebra
        responsive
        breakpoint="200">
        <vscode-table-header slot="header">
          <vscode-table-header-cell>Key</vscode-table-header-cell>
          <vscode-table-header-cell>Value</vscode-table-header-cell>
        </vscode-table-header>
        <vscode-table-body slot="body">
          {Object.entries(body_data).map(([key, value]) => {
            return (
              <vscode-table-row>
                <vscode-table-cell>{key}</vscode-table-cell>
                <vscode-table-cell>
                  <div className="flex w-full items-center justify-between">
                    {value}
                    <div className="flex gap-1 items-center p-1">
                      {editing && key === keyValue.key ? (
                        <vscode-icon
                          name="check"
                          class="hover:text-vscode-list-focusForeground hover:outline p-1 hover:outline-vscode-focusBorder"
                          onClick={() => {
                            setFormData((prev) => {
                              const newBody = { ...prev.body };
                              newBody[key] = keyValue.value;
                              return { ...prev, body: newBody };
                            })
                            setKeyValue({ key: "", value: "" });
                            setEditing(false);
                          }}></vscode-icon>
                      ) : (
                        <vscode-icon
                          name="edit"
                          class="hover:text-vscode-focusBorder hover:outline p-1 hover:outline-vscode-focusBorder"
                          onClick={() => {
                            setKeyValue({ key, value });
                            setEditing(true);
                          }}></vscode-icon>
                      )}
                      <vscode-icon
                        name="chrome-close"
                        class="hover:text-vscode-errorForeground hover:outline p-1 hover:outline-vscode-errorForeground"
                        onClick={() => {
                          setFormData((prev) => {
                            const newBody = { ...prev.body };
                            delete newBody[key];
                            return { ...prev, body: newBody };
                          });
                        }}></vscode-icon>
                    </div>
                  </div>
                </vscode-table-cell>
              </vscode-table-row>
            );
          })}
          <vscode-table-row></vscode-table-row>
        </vscode-table-body>
      </vscode-table>}
    </div>
  );
}
