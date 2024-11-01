import { useOnePublishTargetsStore } from "@/store/one-publish-targets-store";
import { PublishTargetEndpoint } from "./publish-target/PublishTargetEndpoint";
import { PublishTargetFormTabs } from "./publish-target/PublishTargetTabs";
import "@vscode-elements/elements/dist/vscode-icon";
interface PublicationTargetFormContainerProps {}

export function PublicationTargetFormContainer({}: PublicationTargetFormContainerProps) {
  const { oneTarget, setOneTarget,handleSubmitOneTarget,handleDeleteOneTarget } = useOnePublishTargetsStore();
console.log(" oneTAget === ",oneTarget)
  return (
    <div className="w-full h-full flex border-t pt-5 mt-5 flex-col items-center justify-center">
      <h1 className="text-xl ">Publish Target {oneTarget.name}</h1>
      <PublishTargetEndpoint
        endpoint={{
          baseUrl: oneTarget.baseUrl,
          name: oneTarget.name,
          endpoint: oneTarget.endpoint,
          method: oneTarget.method,
        }}
        setEndpoint={(value) =>
          setOneTarget((prev) => {
            return {
              ...prev,
              baseUrl: value.baseUrl ?? prev.baseUrl,
              name: value.name ?? prev.name,
              endpoint: value.endpoint ?? prev.endpoint,
              method: value.method ?? "POST",
            };
          })
        }
      />
      <PublishTargetFormTabs />
      <div className="w-full p-2 flex  items-center  gap-4  ">
        <button
          className="flex justify-center rounded gap-4 items-center"
          onClick={() => handleSubmitOneTarget(oneTarget)}>
          save{" "}
          <vscode-icon
            label="save publish target"
            title="save publish target"
            name="save"
            slot="addons"
            action-icon></vscode-icon>
        </button>
        <button
          className="max-w-[40%] bg-vscode-errorForeground rounded flex justify-center gap-4 items-center"
          onClick={() => handleDeleteOneTarget(oneTarget)}>
          delete
          <vscode-icon
            label="delete publish target"
            title="delete publish target"
            name="trash"
            slot="addons"
            action-icon></vscode-icon>
        </button>
      </div>

    </div>
  );
}
