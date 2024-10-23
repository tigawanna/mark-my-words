// App.tsx
import { vscode } from "./utils/vscode";
import { useEffect, useState } from "react";
import type { PostTarget } from "../extension/utils/config-manager.ts";
import { PublicationSettingsList } from "./components/PublicationSettingsList.tsx";
import { PublicationSettingsForm } from "./components/PublicationSettingsForm.tsx";

function App() {
  const [targets, setTargets] = useState<PostTarget[]>([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    endpoint: "",
    method: "POST" as PostTarget["method"],
    headers: {} as Record<string, string>,
  });

  useEffect(() => {
    vscode.postMessage({ type: "getTargets" });

    const messageListener = (event: MessageEvent) => {
      const message = event.data;
      switch (message.type) {
        case "targetsLoaded":
          setTargets(message.data);
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
    <main className="w-full h-full flex flex-col justify-center items-center gap-5 p-5">
      <h1 className="text-4xl font-bold">Publication Target Configuration</h1>

      <div className="flex flex-col border rounded-lg md:flex-row p-5 justify-evenly items-center gap-5 h-full w-full">
        {/* Target List */}
        <PublicationSettingsList targets={targets} setTargets={setTargets} />
        {/* Add Target Form */}
        <PublicationSettingsForm formData={formData} setFormData={setFormData} />
      </div>
    </main>
  );
}

export default App;
