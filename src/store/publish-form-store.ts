import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { vscode } from "../utils";

interface PublishForm {
  title: string;
  description: string;
  content:string
}
type PublishFormsState = {
    formdata:PublishForm;
    updateFormData: (updatedTarget:Partial<PublishForm>) => void;
    clearFormData: () => void;
  }


export const usePublishFormsStore = create<PublishFormsState>()(
  devtools(
    (set) => ({
      formdata: {title:"",description:"",content:""},
      updateFormData: (updatedTarget: Partial<PublishForm>) => {
        set((state) => ({
          formdata: { ...state.formdata, ...updatedTarget },
        }));
      },
      clearFormData: () => {
        set(() => ({
          formdata: {title:"",description:"",content:""},
        }));
      }
    })
  )
);
