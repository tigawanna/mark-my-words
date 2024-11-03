// target-store
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { vscode } from "../utils";
import { getNestedProperty } from "../utils/helpers";

export interface OnePublishTarget {
  id: string;
  name: string;
  baseUrl: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers: Record<string, string>;
  body: Record<string, string>;
  editing: boolean;
  auth?: {
    name?: string;
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    headers?: Record<string, string>;
    body?: Record<string, string>;
    response?: Record<string, string>;
    tokenMappedTo?: string;
    verification?: {
      name?: string;
      endpoint?: string;
      method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      headers?: Record<string, string>;
      body?: Record<string, string>;
      response?: Record<string, string>;
    };
  };
  response?: {
    status: number;
    headers: Record<string, string>;
    body: string;
  };
  mappings: Record<string, string>;
}
type ONePublishTargetsState = {
  oneTarget: OnePublishTarget;
  setOneTarget: (value: (prevState: OnePublishTarget) => OnePublishTarget) => void;
  setOneTargetAuth: (
    value: (prevState: OnePublishTarget["auth"]) => OnePublishTarget["auth"]
  ) => void;
  setTonekMappings: (value: string) => void;
  handleSubmitOneTarget: (value: OnePublishTarget) => void;
  handleDeleteOneTarget: (value: OnePublishTarget) => void;
};

export const useOnePublishTargetsStore = create<ONePublishTargetsState>()(
  devtools(
    persist(
      (set) => ({
        oneTarget: {
          id: "",
          name: "",
          baseUrl: "",
          endpoint: "",
          method: "POST",
          headers: {},
          body: {},
          editing: false,
          auth: {
            name: "auth",
            body: {},
            endpoint: "",
            headers: {},
            method: "POST",
            response: {},
            verification: {
              name: "auth",
              body: {},
              endpoint: "",
              headers: {
                Authorization: "",
              },
              method: "POST",
              response: {},
            },
            tokenMappedTo: "request.token,headers.Authorization",
          },
          mappings: {
            "formData.title": "body.title",
            "formData.description": "body.description",
            "formData.content": "body.content",
            "request.token": "headers.Authorization",
          },
        },

        setOneTarget: (value) => {
          set((state) => {
            const newTarget = value(state.oneTarget);
            return {
              oneTarget: newTarget,
            };
          });
        },
        setOneTargetAuth: (value) => {
          set((state) => {
            const newTargetAuth = value(state.oneTarget.auth);
            const newTarget = {
              ...state.oneTarget,
              auth: newTargetAuth,
            };
            return {
              oneTarget: newTarget,
            };
          });
        },
        handleSubmitOneTarget: (value) => {
          set((state) => {
            const newTarget = state.oneTarget;
            vscode.postMessage({
              type: "handleSubmittedPublishTargets",
              data: newTarget,
            });
            return {
              oneTarget: newTarget,
            };
          });
        },
        handleDeleteOneTarget: (value) => {
          set((state) => {
            const newTarget = state.oneTarget;
            vscode.postMessage({
              type: "deletePublishTargets",
              data: newTarget,
            });
            return {
              oneTarget: newTarget,
            };
          });
        },
        setTonekMappings: (value) => {
          set((state) => {
            //from.value,to.value
            const mappings = value.split(",");
            const mappingFrom = mappings[0].split(".");
            const mappingTo = mappings[1].split(".");
            const mappingFromValues = getNestedProperty(state.oneTarget, mappingFrom[0]);
            const newTarget = {
              ...state.oneTarget,
              [mappingTo[0]]: {
                [mappingTo[1]]: mappingFromValues,
              },
              auth: { ...state.oneTarget.auth, tokenMappedTo: value },
            };
            return {
              oneTarget: newTarget,
            };
          });
        },
      }),
      {
        name: "one-publish-target",
        storage: createJSONStorage(() => {
          return {
            getItem(name) {
              return vscode.getState()[name];
            },
            setItem(name, value) {
              return vscode.setState({ [name]: value });
            },
            removeItem(name) {
              return vscode.setState({ [name]: undefined });
            },
          };
        }),
      }
    )
  )
);
