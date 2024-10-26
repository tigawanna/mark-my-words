import { useState, useEffect } from "react";
import type { PostTarget } from "../../../extension/utils/config-manager.ts.ts";
import { vscode } from "../../utils/index.ts";
import { PublicationSettingsTable } from "./PublicationSettingsTable.tsx";
import { PublicationSettingsForm } from "./PublicationSettingsForm.tsx";
import { PublishMarkdown } from "./PublishMarkdown.tsx";

interface OldMainPublicationScreenProps {

}

export function OldMainPublicationScreen({}:OldMainPublicationScreenProps){
      const [selectedText, setSelectedText] = useState<string>("");
      const [targets, setTargets] = useState<PostTarget[]>([]);
      const [formData, setFormData] = useState({
        id: "",
        name: "",
        endpoint: "",
        method: "POST" as PostTarget["method"],
        headers: {} as Record<string, string>,
        body: {} as Record<string, string>,
        editing: false,
      });

      useEffect(() => {
        // Signal that the webview is ready to receive data
        vscode.postMessage({ type: "ready" });

        const messageListener = (event: MessageEvent) => {
          const message = event.data;
          switch (message.type) {
            case "immediate":
              if (
                message.data &&
                message.data.selectedText &&
                message.data.selectedText.length > 1
              ) {
                setSelectedText(message.data.selectedText);
                setFormData((prev) => ({
                  ...prev,
                  content: message.data.selectedText || "",
                }));
              }
              break;
            case "initialData":
              if (message.data) {
                setTargets(message.data.targets || []);
              }
              break;

            case "targetsLoaded":
              setTargets(message.data || []);
              break;

            case "targetAdded":
              setTargets((prev) => [...prev, message.data]);
              break;

            case "targetDeleted":
              setTargets((prev) => prev.filter((t) => t.id !== message.data));
              break;

            case "targetUpdated":
              setTargets((prev) => prev.map((t) => (t.id === message.data.id ? message.data : t)));
              break;
          }
        };

        window.addEventListener("message", messageListener);
        return () => window.removeEventListener("message", messageListener);
      }, []);
return (
 <div className='w-full h-full flex flex-col items-center justify-center'>
      <h1 className="text-4xl font-bold text-start">Mark my words</h1>
      <PublishMarkdown
        targets={targets}
        selectedText={selectedText}
        setSelectedText={setSelectedText}
      />
      <h1 className="text-xl font-bold">Publication Target Configuration</h1>
      <div className="flex flex-col rounded-lg  p-5 justify-evenly items-center gap-5 h-full w-full">
        {/* Target List */}
        <PublicationSettingsTable
          targets={targets}
          setTargets={setTargets}
          setFormData={setFormData}
        />
        {/* <PublicationSettingsList targets={targets} setTargets={setTargets} setFormData={setFormData}/> */}
        {/* Add Target Form */}
        <PublicationSettingsForm formData={formData} setFormData={setFormData} />
      </div>
 </div>
);
}
