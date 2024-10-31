// App.tsx
import { useEffect } from "react";
import { vscode } from "./utils";
import { usePublishFormsStore } from "./store/publish-form-store";
import { extractTitleAndDescription } from "./utils/helpers";
import { MainContainer } from "./components/MainContainer";
import { usePublishTargetsStore } from "./store/targets-store";

export function App() {
  const updateFormData = usePublishFormsStore((state) => state.updateFormData);
  const setTargets = usePublishTargetsStore((state) => state.setTargets);
  const targets = usePublishTargetsStore((state) => state.targets);

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
        case "initialPayload":
        case "selectedText":
        case "selectionChanged":
          if (message.data) {
            // if (message.data.publishTargets && message.data.publishTargets.length > 1) {
            //   setTargets((prevTargets) => {
            //     return [...prevTargets, ...message.data.publishTargets];
            //   });
            // }
            if (message.data.selectedText && message.data.selectedText.length > 1) {
              const inferredLabels = extractTitleAndDescription(message.data.selectedText);
              if (inferredLabels) {
                updateFormData({
                  content: inferredLabels.content,
                  title: inferredLabels.title,
                  description: inferredLabels.description,
                });
              }
            }
          }
          break;
        case "publishTargets":
          if (message.data && message.data.length > 0) {
            setTargets((prevTargets) => {
              return [...prevTargets, ...message.data];
            });
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
      // vscode.postMessage({
      //   type: "updatePublishTarget",
      //   data: targets,
      // });
      window.removeEventListener("message", messageListener);
    };
  }, []);
  return (
    <main className="w-full h-full flex flex-col justify-center items-center gap-5 p-5">
      <MainContainer />
    </main>
  );
}
