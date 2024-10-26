// App.tsx
import { useEffect } from "react";
import { MainPublicationScreen } from "./components/publish-section/MainPublicationScreen";
import { usePublishFormsStore } from "./store/publish-form-store";

function App() {
  const updateFormData = usePublishFormsStore((state) => state.updateFormData);
  useEffect(() => {
    const messageListener = (event: MessageEvent) => {
      const message = event.data;
      switch (message.type) {
        case "immediate":
          if (message.data && message.data.selectedText && message.data.selectedText.length > 1) {
            updateFormData({
              content: message.data.selectedText || "",
            });
            // setSelectedText(message.data.selectedText);
            // setFormData((prev) => ({
            //   ...prev,
            //   content: message.data.selectedText || "",
            // }));
          }
          break;
      }
    };

    window.addEventListener("message", messageListener);
    return () => window.removeEventListener("message", messageListener);
  }, []);
  return (
    <main className="w-full h-full flex flex-col justify-center items-center gap-5 p-5">
      <MainPublicationScreen />
    </main>
  );
}

export default App;
