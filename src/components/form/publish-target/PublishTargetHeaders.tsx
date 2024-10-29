import "@vscode-elements/elements/dist/vscode-icon";
import "@vscode-elements/elements/dist/vscode-table";
import "@vscode-elements/elements/dist/vscode-table-header";
import "@vscode-elements/elements/dist/vscode-table-header-cell";
import "@vscode-elements/elements/dist/vscode-table-body";
import "@vscode-elements/elements/dist/vscode-table-row";
import "@vscode-elements/elements/dist/vscode-table-cell";

import { useState } from "react";
import type { PublishTarget } from "@/store/targets-store";
interface PublishTargetHeadersProps {
  headers: Record<string, string>;
  setFormHeaders: (value: PublishTarget["headers"]) => void;
  removeFormHeader: (value: PublishTarget["headers"]) => void;
}

export function PublishTargetHeaders({ headers, setFormHeaders,removeFormHeader }: PublishTargetHeadersProps) {
  const [editing, setEditing] = useState(false);
  const [header, setHeader] = useState<{ key: string; value: string }>({
    key: "",
    value: "",
  });
  const handleAddHeader = (header: { key: string; value: string }) => {
    setFormHeaders({
      [header.key]: header.value,
    });
    setHeader({
      key: "",
      value: "",
    });
  };
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-2 w-full">
        <input
          type="text"
          placeholder="Header Key"
          value={header.key}
          onChange={(e) =>
            setHeader((prev) => {
              return {
                ...prev,
                key: e.currentTarget.value,
              };
            })
          }
          className=""
        />
        <input
          type="text"
          placeholder="Header Value"
          value={header.value}
          onChange={(e) =>
            setHeader((prev) => {
              return {
                ...prev,
                value: e.currentTarget.value,
              };
            })
          }
          className=""
        />
        <button type="button" onClick={() => handleAddHeader(header)} className="w-fit min-w-[10%]">
          Add
        </button>
      </div>

      <vscode-table
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
          {Object.entries(headers).map(([key, value]) => {
            return (
              <vscode-table-row key={key}>
                <vscode-table-cell>{key}</vscode-table-cell>
                <vscode-table-cell>
                  <div className="flex w-full items-center justify-between">
                    {value}
                    <div className="flex gap-1 items-center p-1">
                      {editing && key === header.key ? (
                        <vscode-icon
                          name="check"
                          class="hover:text-vscode-list-focusForeground hover:outline p-1 hover:outline-vscode-focusBorder"
                          onClick={() => {
                            // setFormHeaders((prev) => {
                            //   const newHeaders = { ...prev.headers };
                            //   newHeaders[key] = header.value;
                            //   return { ...prev, headers: newHeaders };
                            // });
                            setFormHeaders({ ...headers, [key]: value });
                            setHeader({ key: "", value: "" });
                            setEditing(false);
                          }}></vscode-icon>
                      ) : (
                        <vscode-icon
                          name="edit"
                          class="hover:text-vscode-focusBorder hover:outline p-1 hover:outline-vscode-focusBorder"
                          onClick={() => {
                            setHeader({ key, value });
                            setEditing(true);
                          }}></vscode-icon>
                      )}
                      <vscode-icon
                        name="chrome-close"
                        class="hover:text-vscode-errorForeground hover:outline p-1 hover:outline-vscode-errorForeground"
                        onClick={() => {
                          // setFormHeaders((prev) => {
                          //   const newHeaders = { ...prev.headers };
                          //   delete newHeaders[key];
                          //   return { ...prev, headers: newHeaders };
                          // });
                            const newHeaders = { ...headers };
                            delete newHeaders[key];
                            removeFormHeader(newHeaders);
                        }}></vscode-icon>
                    </div>
                  </div>
                </vscode-table-cell>
              </vscode-table-row>
            );
          })}
          <vscode-table-row></vscode-table-row>
        </vscode-table-body>
      </vscode-table>
    </div>
  );
}
