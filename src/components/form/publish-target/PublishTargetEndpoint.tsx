import "@vscode-elements/elements/dist/vscode-single-select";
import "@vscode-elements/elements/dist/vscode-option";
import { useEffect, useRef } from "react";
import type { VscodeSingleSelect } from "@vscode-elements/elements/dist/vscode-single-select";
import { usePublishTargetsStore, type PublishTarget } from "../../../store/targets-store";
interface MethodsSelectProps {
  formData: PublishTarget;
  setFormData: React.Dispatch<React.SetStateAction<PublishTarget>>;
}

export function MethodsSelect({ formData, setFormData }: MethodsSelectProps) {
  const selectRef = useRef<VscodeSingleSelect>(null);
  useEffect(() => {
    const select = selectRef?.current;
    const selectEventListener = (_: Event) => {
      setFormData((prev) => ({
        ...prev,
        method: select?.value as PublishTarget["method"],
      }));
    };
    select?.addEventListener("change", selectEventListener);
    return () => {
      select?.removeEventListener("change", selectEventListener);
    };
  }, []);

  return (
    <vscode-single-select
      ref={selectRef}
      value={formData.method}
      class="w-fit min-w-[100px]"
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
  );
}


interface PublishTargetEndpointProps {

}

export function PublishTargetEndpoint({}:PublishTargetEndpointProps){
  const {one_target, setOneTarget} = usePublishTargetsStore()
return (
  <div className="flex flex-wrap w-full gap-2 items-center p-5">
    <div className="flex w-full gap-2 items-center">
      <input
        type="text"
        value={one_target.name}
        onChange={(e) => setOneTarget((prev) => ({ ...prev, name: e.target.value }))}
        className="w-fit max-w-[80%] flex-grow"
        placeholder="Name"
        required
      />
      <div className="flex w-fit  gap-2 items-center">
        <MethodsSelect formData={one_target} setFormData={setOneTarget} />
      </div>
    </div>
    <input
      type="url"
      value={one_target.endpoint}
      onChange={(e) => setOneTarget((prev) => ({ ...prev, endpoint: e.target.value }))}
      className="w-full"
      placeholder="Endpoint"
      required
    />
  </div>
);
}
