import { useState } from "react";
import type { PostTarget } from "../../extension/utils/config-manager.ts";
import { vscode } from "../utils/vscode.ts";
import "@vscode-elements/elements/dist/vscode-badge";
import "@vscode-elements/elements/dist/vscode-button";
import "@vscode-elements/elements/dist/vscode-single-select";
import { HeadersTable } from "./HeadersTable.tsx";
interface PublicationSettingsFormProps {
  formData: PostTarget & { editing: boolean };
  setFormData: React.Dispatch<React.SetStateAction<PostTarget & { editing: boolean }>>;
}

export function PublicationSettingsForm({ formData, setFormData }: PublicationSettingsFormProps) {
  const [header, setHeader] = useState<{ key: string; value: string }>({
    key: "",
    value: "",
  });
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTarget: PostTarget = {
      ...formData,
      id: crypto.randomUUID(),
      headers: {
        ...formData.headers,
        [header.key]: header.value,
      },
    };

    if (formData.editing) {
      vscode.postMessage({
        type: "updateTarget",
        data: {
          id: formData.id,
          target: {
            ...formData,
            editing: false,
          },
        },
      });
    } else {
      vscode.postMessage({
        type: "addTarget",
        data: newTarget,
      });
    }

    setFormData({
      id: "",
      name: "",
      endpoint: "",
      method: "POST",
      headers: {},
      editing: false,
    });
    setHeader({
      key: "",
      value: "",
    });
  };

  const handleAddHeader = (header: { key: string; value: string }) => {
    setFormData((prev) => {
      return {
        ...prev,
        headers: {
          ...prev.headers,
          [header.key]: header.value,
        },
      };
    });
  };

  return (
    <div className="flex flex-col gap-2 h-full justify-center items-center">
      <vscode-button>Primary button</vscode-button>
      <vscode-badge variant="activity-bar-counter">uwu</vscode-badge>
      <h2 className="text-xl font-bold">Add New Publish Target</h2>
      <form onSubmit={handleFormSubmit} className="form">
        <div className="flex flex-col gap-2">
          <label className="form-label">
            Name:
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="form-input"
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">
            Endpoint:
            <input
              type="url"
              value={formData.endpoint}
              onChange={(e) => setFormData((prev) => ({ ...prev, endpoint: e.target.value }))}
              className="form-input"
              required
            />
          </label>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="form-label">
            Method:
            <vscode-single-select
              value={formData.method}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  method: e.target.value as PostTarget["method"],
                }))
              }
              id="select-example">
              <vscode-option description="POST method" value="POST">
                POST
              </vscode-option>
              <vscode-option selected description="GET method" value="GET">
                GET
              </vscode-option>
              <vscode-option description="PUT method" value="PUT">
                PUT
              </vscode-option>
              <vscode-option description="PATCH method" value="PATCH">
                PATCH
              </vscode-option>
              <vscode-option description="DELETE method" value="DELETE">
                DELETE
              </vscode-option>
            </vscode-single-select>
          </label>
        </div>

        {/* Headers Section */}
        <div className="flex flex-col gap-2 w-full">
          <h3 className="">Headers</h3>
          <div className="flex gap-2 w-full">
            <input
              type="text"
              placeholder="Header Key"
              value={header.key}
              onChange={(e) =>
                setHeader((prev) => {
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
              placeholder="Header Value"
              value={header.value}
              onChange={(e) =>
                setHeader((prev) => {
                  return {
                    ...prev,
                    value: e.target.value,
                  };
                })
              }
              className=""
            />
            <button
              type="button"
              onClick={() => handleAddHeader(header)}
              className="add-header-button">
              Add
            </button>
          </div>
          <HeadersTable headers={formData.headers} />
          <ul className="flex flex-wrap gap-2">
            {/* Display current headers */}
            {Object.entries(formData.headers).length > 0 && (
              <div className="flex flex-wrap  gap-2 w-full">
                {Object.entries(formData.headers).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-center items-center px-2 gap-2 border rounded-lg">
                    <span className="">
                      {key}: {value}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newHeaders = { ...formData.headers };
                        delete newHeaders[key];
                        setFormData((prev) => ({ ...prev, headers: newHeaders }));
                      }}
                      className="size-8 rounded-lg">
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </ul>
        </div>

        <button type="submit" className="submit-button">
          Add Target
        </button>
      </form>
    </div>
  );
}
