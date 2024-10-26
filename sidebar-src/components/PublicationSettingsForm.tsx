import { useState } from "react";
import type { PostTarget } from "../../extension/utils/config-manager.ts.ts";
import { vscode } from "../utils/vscode.ts";
import "@vscode-elements/elements/dist/vscode-badge";
import "@vscode-elements/elements/dist/vscode-button";

import { HeadersTable } from "./HeadersTable.tsx";
import { MethodsSelect } from "./MethodsSelect.tsx";
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
    <div className="flex flex-col gap-2 h-full justify-center items-center rounded-lg ">
      <h2 className="text-lg">{formData.editing ? "Edit" : "Add New"} Publish Target</h2>
      <form
        onSubmit={handleFormSubmit}
        className="form flex flex-col gap-2 p-5 border border-vscode-editorGroup-dropBackground">
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

        <div className="flex flex-col w-full gap-2 ">
          <label className="form-label">Endpoint:</label>
          <div className="flex w-full gap-2 items-center">
            <MethodsSelect formData={formData} setFormData={setFormData} />
            <input
              type="url"
              value={formData.endpoint}
              onChange={(e) => setFormData((prev) => ({ ...prev, endpoint: e.target.value }))}
              className="w-full"
              required
            />
          </div>
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
          <HeadersTable headers={formData.headers} setFormData={setFormData} />
        </div>

        <button type="submit" className="submit-button">
          {formData.editing ? "Update" : "Add"} Target
        </button>
      </form>
    </div>
  );
}
