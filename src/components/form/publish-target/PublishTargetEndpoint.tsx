import "@vscode-elements/elements/dist/vscode-single-select";
import "@vscode-elements/elements/dist/vscode-option";
import { useEffect, useRef } from "react";
import type { VscodeSingleSelect } from "@vscode-elements/elements/dist/vscode-single-select";
import { type PublishTarget } from "@/store/targets-store";
import { addBaseUrlToUrl } from "@/utils/helpers";
interface MethodsSelectProps {
  method: PublishTarget["method"];
  setMethod: (value: PublishTarget["method"]) => void;
}

export function MethodsSelect({ method, setMethod }: MethodsSelectProps) {
  const selectRef = useRef<VscodeSingleSelect>(null);
  useEffect(() => {
    const select = selectRef?.current;
    const selectEventListener = (_: Event) => {
      setMethod(select?.value as PublishTarget["method"]);
    };
    select?.addEventListener("change", selectEventListener);
    return () => {
      select?.removeEventListener("change", selectEventListener);
    };
  }, []);

  return (
    <vscode-single-select
      ref={selectRef}
      value={method}
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

type Endpoint = Pick<PublishTarget, "name" | "endpoint" | "method" | "baseUrl"> &
  Partial<Pick<PublishTarget, "headers" | "body">>;

interface PublishTargetEndpointProps {
  endpoint: Endpoint;
  setEndpoint: (value: Partial<PublishTarget>) => void;
}

export function PublishTargetEndpoint({ endpoint, setEndpoint }: PublishTargetEndpointProps) {
  return (
    <div className="flex flex-wrap w-full gap-2 shadow-vscode-widget-shadow p-2 items-center">
      <div className="flex w-full gap-2 items-center">
        <input
          type="text"
          value={endpoint.name}
          onChange={(e) => {
            setEndpoint({ ...endpoint, name: e.currentTarget.value });
          }}
          className="w-fit "
          placeholder="Name"
          required
        />
        <input
          type="url"
          value={endpoint.baseUrl}
          onChange={(e) => {
            setEndpoint({ ...endpoint, baseUrl: e.currentTarget.value });
          }}
          className="w-full flex-grow"
          placeholder="Base Url"
          required
        />
        <div className="flex w-fit  gap-2 items-center">
          <MethodsSelect
            method={endpoint.method}
            setMethod={(value) => {
              setEndpoint({ ...endpoint, method: value });
            }}
          />
        </div>
      </div>
      <input
        value={endpoint.endpoint}
        onChange={(e) =>
          setEndpoint({
            ...endpoint,
            endpoint: addBaseUrlToUrl(e.currentTarget.value, endpoint.baseUrl),
          })
        }
        className="w-full"
        placeholder="Endpoint"
        required
      />
    </div>
  );
}
