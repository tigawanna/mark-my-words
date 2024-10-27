import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { vscode } from "../utils";
import { getNestedProperty } from "../utils/object-helpers";

export interface PublishTarget {
  id: string;
  name: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers: Record<string, string>;
  body: Record<string, string>;
  editing: boolean;
  auth?: {
    name: string;
    endpoint: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    headers: Record<string, string>;
    body: Record<string, string>;
    response: Record<string, string>;
    tokenMappedTo: string;
  };
  response?: {
    status: number;
    headers: Record<string, string>;
    body: string;
  };
  mappings: Record<string, string>;
}
type PublishTargetsState = {
  oneTarget: PublishTarget;
  setOneTarget: (value: Partial<PublishTarget>) => void;
  setOneTargetAuth: (value: Partial<PublishTarget["auth"]>) => void
  targets: PublishTarget[];
  addTarget: (target: PublishTarget) => void;
  updateTarget: (targetId: string, updatedTarget: PublishTarget) => void;
  deleteTarget: (targetId: string) => void;
  setTokenMappedTo: (value: string) => void;
};


export const usePublishTargetsStore = create<PublishTargetsState>()(
  devtools(
    persist(
      (set) => ({
        oneTarget: {
          id: "",
          name: "",
          endpoint: "",
          method: "GET",
          headers: {},
          body: {},
          editing: false,
          auth: {
            name: "auth",
            body: {},
            endpoint: "https://example.com",
            headers: {},
            method: "POST",
            response: {},
            tokenMappedTo: "request.token,headers.Authorization",
          },
          mappings: {
            title: "body.title",
            description: "body.description",
            content: "body.content",
          },
        },
        setTokenMappedTo(value) {
          // @ts-expect-error
          set((state) => {
            const mappings = value.split(",");
            const mappingFrom = mappings[0].split(".");
            const mappingTo = mappings[1].split(".");
            const mappingFromValues = getNestedProperty(state.oneTarget, mappingFrom[0])
            const newTarget = { ...state.oneTarget,
              [mappingTo[0]]: {
                [mappingTo[1]]: mappingFromValues
              },
              auth: { ...state.oneTarget.auth, tokenMappedTo: value } };
            const existingTargetIndex = state.targets.findIndex(
              (target) => target.id === newTarget.id
            );
            if (existingTargetIndex > -1) {
              return {
                targets: state.targets.map((target, index) =>
                  index === existingTargetIndex ? newTarget : target
                ),
                oneTarget: newTarget,
              };
            } else {
              return {
                targets: [...state.targets, newTarget],
                oneTarget: newTarget,
              };
            }
          });
        },
        setOneTarget: (value) => {
          set((state) => {
            const newTarget = { ...state.oneTarget, ...value };
            const existingTargetIndex = state.targets.findIndex(
              (target) => target.id === newTarget.id
            );
            if (existingTargetIndex > -1) {
              return {
                targets: state.targets.map((target, index) =>
                  index === existingTargetIndex ? newTarget : target
                ),
                oneTarget: newTarget,
              };
            } else {
              return {
                targets: [...state.targets, newTarget],
                oneTarget: newTarget,
              };
            }
          });
        },
        setOneTargetAuth: (value) => {
          // @ts-expect-error
          set((state) => {
            const newTarget = { ...state.oneTarget, auth: { ...state.oneTarget.auth, ...value } };
            const existingTargetIndex = state.targets.findIndex(
              (target) => target.id === newTarget.id
            );
            if (existingTargetIndex > -1) {
              return {
                targets: state.targets.map((target, index) =>
                  index === existingTargetIndex ? newTarget : target
                ),
                oneTarget: newTarget,
              };
            } else {
              return {
                targets: [...state.targets, newTarget],
                oneTarget: newTarget,
              };
            }
          });
        },
        targets: [],
        addTarget: (target) => {
          set((state) => ({
            targets: [...state.targets, target],
          }));
        },
        updateTarget: (targetId, updatedTarget) => {
          set((state) => ({
            targets: state.targets.map((target) =>
              target.id === targetId ? updatedTarget : target
            ),
          }));
        },
        deleteTarget: (targetId) => {
          set((state) => ({
            targets: state.targets.filter((target) => target.id !== targetId),
          }));
        },
      }),
      {
        name: "publish-targets",
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
