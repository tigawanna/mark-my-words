import { usePublishFormsStore } from "../../store/publish-form-store";

interface PublishSelectionFormProps {}

export function PublishSelectionForm({}: PublishSelectionFormProps) {
  const { formdata } = usePublishFormsStore();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <form className="w-full h-full flex flex-col gap-2 items-center justify-center">
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
                usePublishFormsStore.getState().updateFormData({ title: e.target.value })
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
                usePublishFormsStore.getState().updateFormData({ description: e.target.value })
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
              usePublishFormsStore.getState().updateFormData({ content: e.target.value })
            }
          />
        </label>
      </form>
    </div>
  );
}
