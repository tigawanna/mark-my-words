import "@vscode-elements/elements/dist/vscode-icon";
import { PublishForm, usePublishFormsStore } from "@/store/publish-form-store";
import { doPublish } from "./publish-target/auth-api";
import { OnePublishTarget, useOnePublishTargetsStore } from "@/store/one-publish-targets-store";
import { useEffect } from "preact/hooks";
import {mapFieldsToValues } from "@/utils/helpers";
import { useMutation } from "@/hooks/use-mutation";
interface PublishDetailsFormProps {}

export function PublishDetailsForm({}: PublishDetailsFormProps) {
  const { oneTarget,setOneTarget } = useOnePublishTargetsStore();
  const { formdata } = usePublishFormsStore();
  useEffect(() => {
    const remappedFields = mapFieldsToValues(formdata, oneTarget);
    setOneTarget((prev) => ({
      ...prev,
      body:remappedFields.body,
    }));
  }, [formdata])

  const mutation = useMutation({
       mutationFn({formdata, oneTarget}:{formdata:PublishForm, oneTarget:OnePublishTarget}) {
         return doPublish(formdata, oneTarget);
       },
  })
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full h-full flex flex-col gap-5 items-center justify-center">
        <div className="w-full flex flex-col md:flex-row gap-2 items-center">
          <label htmlFor="title" className="w-full h-full flex flex-col  justify-center">
            <div className="text-lg font-bold text-vscode-descriptionForeground">Title</div>
            <input
              className=""
              placeholder="Title"
              name="title"
              type="text"
              value={formdata.title}
              onChange={(e) =>
                usePublishFormsStore.getState().updateFormData({ title: e.currentTarget.value })
              }
            />
          </label>
          <label htmlFor="description" className="w-full h-full flex flex-col  justify-center">
            <div className="text-lg font-bold text-vscode-descriptionForeground">Description</div>
            <input
              type="text"
              placeholder="Description"
              name="descriptioon"
              value={formdata.description}
              onChange={(e) =>
                usePublishFormsStore
                  .getState()
                  .updateFormData({ description: e.currentTarget.value })
              }
            />
          </label>
        </div>
        <label htmlFor="content" className="w-full h-full flex flex-col  justify-center">
          <textarea
            placeholder="Content"
            className="p-4 rounded-lg"
            rows={6}
            name="content"
            value={formdata.content}
            onChange={(e) =>
              usePublishFormsStore.getState().updateFormData({ content: e.currentTarget.value })
            }
          />
        </label>
        <button
          className=" max-w-[70%]  flex  justify-center gap-4 items-center"
          onClick={() => mutation.mutate({formdata, oneTarget})}>
          publish
        {mutation.isLoading ? (
          <vscode-icon
            class="animate-spin"
            label="Close Panel"
            title="Close Panel"
            name="settings-gear"
            slot="addons"
            action-icon></vscode-icon>
        ) : (
          <vscode-icon
            label="delete publish target"
            title="delete publish target"
            name="check-all"
            slot="addons"
            action-icon></vscode-icon>
        )}
        </button>
      </div>
    </div>
  );
}
