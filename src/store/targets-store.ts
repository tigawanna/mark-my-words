import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { vscode } from "../utils";

interface PublishTarget {
  id: string;
  name: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers: Record<string, string>;
  body: Record<string, string>;
}
type PublishTargetsState = {
    targets:PublishTarget[];
    addTarget: (target: PublishTarget) => void;
    updateTarget: (targetId: string, updatedTarget: PublishTarget) => void;
    deleteTarget: (targetId: string) => void;
  }


export const usePublishTargetsStore = create<PublishTargetsState>()(
  devtools(
    persist(
      (set) => ({
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
