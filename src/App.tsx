// App.tsx
import { useEffect } from "react";
import { usePublishFormsStore } from "./store/publish-form-store";
import { MainContainer } from "./components/MainContainer";
import { vscode } from "./utils";

function App() {
  const updateFormData = usePublishFormsStore((state) => state.updateFormData);
  // useEffect(() => {
  //       vscode.postMessage("ready");
  // },[])
  useEffect(() => {
    vscode.postMessage("ready");
    const messageListener = (event: MessageEvent) => {
      const message = event.data;
      switch (message.type) {
        case "selectedText":
        case "selectionChanged":
          if (message.data && message.data.selectedText && message.data.selectedText.length > 1) {
            const inferredLabels = extractTitleAndDescription(message.data.selectedText);
            console.info({ inferredLabels });
            if (inferredLabels) {
              updateFormData({
                content: inferredLabels.content,
                title: inferredLabels.title,
                description: inferredLabels.description,
              });
            }

            // updateFormData({
            //   content: message.data.selectedText || "",
            // });
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

export default App;

function extractTitleAndDescription(content: string) {
  // ---Title: nice code---
  // ---Description: nicer code block---
  const lines = content.split("\n");
  const inferredLabels = lines.reduce(
    (acc, line: string,) => {
      if (line.includes("---Title")) {
        const [k, v] = line.split("---Title");
        acc["title"] = v.trim().replace("---", "").replace(":", "");
      }
      if (line.includes("---Description")) {
        const [k, v] = line.split("---Description");
        acc["description"] = v.trim().replace("---", "").replace(":", "");

      }

      return acc;
    },
    { title: "Untitled", description: ""}
  );
  const linesWithoutTitleAndDescription = lines
  .filter((item)=>{
    if(item.includes("---Title") || item.includes("---Description")){
      return false
    }
    return true
  })
    .join("\n");
  return { ...inferredLabels, content: linesWithoutTitleAndDescription };
}
