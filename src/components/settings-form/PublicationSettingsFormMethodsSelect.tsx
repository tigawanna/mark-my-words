import "@vscode-elements/elements/dist/vscode-single-select";
import "@vscode-elements/elements/dist/vscode-option";
import type { PostTarget } from "../../../extension/utils/config-manager.ts";
import { useEffect, useRef } from "react";
import type { VscodeSingleSelect } from "@vscode-elements/elements/dist/vscode-single-select";
interface MethodsSelectProps {
  formData: PostTarget & { editing: boolean };
  setFormData: React.Dispatch<React.SetStateAction<PostTarget & { editing: boolean }>>;
}

export function MethodsSelect({ formData, setFormData }: MethodsSelectProps) {
  const selectRef = useRef<VscodeSingleSelect>(null);
  useEffect(() => {
    const select = selectRef?.current;
    const selectEventListener = (_: Event) => {
      setFormData((prev) => ({
        ...prev,
        method: select?.value as PostTarget["method"],
      }))
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
