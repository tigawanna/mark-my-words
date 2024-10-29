// App.tsx
import { useEffect } from "react";
import { vscode } from "./utils";
import { usePublishFormsStore } from "./store/publish-form-store";
import { extractTitleAndDescription } from "./utils/object-helpers";
import { MainContainer } from "./components/MainContainer";

export function App() {
  const updateFormData = usePublishFormsStore((state) => state.updateFormData);

  // // ❌
  // useEffect(() => {
  //   vscode.postMessage("ready");
  // }, []);

  // ✅
  useEffect(() => {
    vscode.postMessage({
      type: "ready",
    });
  }, []);

  useEffect(() => {
    // vscode.postMessage("ready");
    const messageListener = (event: MessageEvent) => {
      const message = event.data;
      switch (message.type) {
        case "initialSelectedText":
        case "selectedText":
        case "selectionChanged":
          if (message.data && message.data.selectedText && message.data.selectedText.length > 1) {
            const inferredLabels = extractTitleAndDescription(message.data.selectedText);
            if (inferredLabels) {
              updateFormData({
                content: inferredLabels.content,
                title: inferredLabels.title,
                description: inferredLabels.description,
              });
            }
          }
          break;
      }
    };

    window.addEventListener("message", messageListener);
    return () => {
      updateFormData({
        content: "",
        title: "",
        description: "",
      });
      window.removeEventListener("message", messageListener);
    };
  }, []);
  return (
    <main className="w-full h-full flex flex-col justify-center items-center gap-5 p-5">
      <MainContainer />
    </main>
  );
}


