import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { vscode } from "../utils";

export interface PublishTarget {
  id: string;
  name: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers: Record<string, string>;
  body: Record<string, string>;
  editing: boolean;
  mappings:{
    title:"body.title",
    description:"body.description",
    content:"body.content"
  }
}
type PublishTargetsState = {
    one_target:PublishTarget;
    setOneTarget: (value: React.SetStateAction<PublishTarget>) => void;
    targets:PublishTarget[];
    addTarget: (target: PublishTarget) => void;
    updateTarget: (targetId: string, updatedTarget: PublishTarget) => void;
    deleteTarget: (targetId: string) => void;
  }


export const usePublishTargetsStore = create<PublishTargetsState>()(
  devtools(
    persist(
      (set) => ({
        one_target: {
          id: "",
          name: "",
          endpoint: "",
          method: "GET",
          headers: {},
          body: {},
          editing: false,
          mappings:{
            title:"body.title",
            description:"body.description",
            content:"body.content"
          }
        },
        setOneTarget: (value) => {
          set((state) => {
            const newTarget = { ...state.one_target, ...value };
            const existingTargetIndex = state.targets.findIndex(
              (target) => target.id === newTarget.id
            );
            if (existingTargetIndex > -1) {
              return {
                targets: state.targets.map((target, index) =>
                  index === existingTargetIndex ? newTarget : target
                ),
                one_target: newTarget,
              };
            } else {
              return {
                targets: [...state.targets, newTarget],
                one_target: newTarget,
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
