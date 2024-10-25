import "@vscode-elements/elements/dist/vscode-icon";
import "@vscode-elements/elements/dist/vscode-table";
import "@vscode-elements/elements/dist/vscode-table-header";
import "@vscode-elements/elements/dist/vscode-table-header-cell";
import "@vscode-elements/elements/dist/vscode-table-body";
import "@vscode-elements/elements/dist/vscode-table-row";
import "@vscode-elements/elements/dist/vscode-table-cell";
import type { PostTarget } from "../../extension/utils/config-manager.ts";
interface HeadersTableProps {
headers: Record<string, string>;
  setFormData: (
    value: React.SetStateAction<
      PostTarget & {
        editing: boolean;
      }
    >
  ) => void;
}

export function HeadersTable({ headers,setFormData }: HeadersTableProps) {
  return (
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
        {Object.entries(headers).map(([key, value]) => (
          <vscode-table-row>
            <vscode-table-cell>{key}</vscode-table-cell>
            <vscode-table-cell>
              <div className="flex w-full items-center justify-between">
                {value}{" "}
                <vscode-icon
                  name="chrome-close"
                  onClick={() => {
                      setFormData((prev) => { 
                        const newHeaders = { ...prev.headers };
                        delete newHeaders[key];
                        return {...prev, headers: newHeaders }
                    });
                  }}></vscode-icon>
              </div>
            </vscode-table-cell>
          </vscode-table-row>
        ))}
        <vscode-table-row></vscode-table-row>
      </vscode-table-body>
    </vscode-table>
  );
}
