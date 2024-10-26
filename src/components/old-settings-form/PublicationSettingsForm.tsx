import type { PostTarget } from "../../../extension/utils/config-manager.ts.ts";
import { vscode } from "../../utils/vscode.ts";
import "@vscode-elements/elements/dist/vscode-badge";
import "@vscode-elements/elements/dist/vscode-button";
import { MethodsSelect } from "./PublicationSettingsFormMethodsSelect.tsx";
import { PublishFormSettingsTabs } from "./PublishFormSettingsTabs.tsx";


interface PublicationSettingsFormProps {
  formData: PostTarget & { editing: boolean };
  setFormData: React.Dispatch<React.SetStateAction<PostTarget & { editing: boolean }>>;
}

export function PublicationSettingsForm({ formData, setFormData }: PublicationSettingsFormProps) {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTarget: PostTarget = {
      ...formData,
      id: crypto.randomUUID(),
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
      body: {},
    });
  };

  return (
    <div className="flex flex-col gap-2 h-full justify-center items-center rounded-lg ">
      <h2 className="text-lg">{formData.editing ? "Edit" : "Add New"} Publish Target</h2>
      <form
        onSubmit={handleFormSubmit}
        className="form flex flex-col gap-2 p-1 border border-vscode-editorGroup-dropBackground">
        <div className="flex flex-wrap w-full gap-2 items-center p-5">
          <div className="flex w-full gap-2 items-center">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-fit max-w-[80%] flex-grow"
              placeholder="Name"
              required
            />
            <div className="flex w-fit  gap-2 items-center">
              <MethodsSelect formData={formData} setFormData={setFormData} />
            </div>
          </div>
          <input
            type="url"
            value={formData.endpoint}
            onChange={(e) => setFormData((prev) => ({ ...prev, endpoint: e.target.value }))}
            className="w-full"
            placeholder="Endpoint"
            required
          />
        </div>
        <PublishFormSettingsTabs formData={formData} setFormData={setFormData} />
        <button type="submit" className="submit-button ">
          {formData.editing ? "Update" : "Add"} Target
        </button>
      </form>
    </div>
  );
}
