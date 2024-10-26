import { useState } from "react";
import type { PostTarget } from "../../extension/utils/config-manager.ts.ts";
import { makeFetchRequest } from "./publish-section/api.ts";

interface PublishMarkdownProps {
  targets: PostTarget[];
  selectedText: string;
  setSelectedText: React.Dispatch<React.SetStateAction<string>>;
}

export function PublishMarkdown({ targets, selectedText, setSelectedText }: PublishMarkdownProps) {
  const [selectedTargets, setSelectedTargets] = useState<PostTarget[]>([]);
  return (
    <div className="flex w-full flex-col  justify-center items-center gap-2">
      {targets.length === 0 ? (
        <p className="empty-message">pick where to publish to</p>
      ) : (
        <ul className="w-full h-full flex flex-wrap p-2 gap-1">
          <h2 className="text-xl font-bold">Publish to</h2>
          {targets.map((target) => (
            <li key={target.id} className="flex h-full w-full rounded-lg p-2 ">
              <div className="flex  gap-1 text-xl rounded-lg bg-vscode-editorGroup-dropBackground">
                <input
                  className="p-5"
                  type="checkbox"
                  value={target.id}
                  checked={selectedTargets.find((t) => t.id === target.id) ? true : false}
                  onChange={() =>
                    setSelectedTargets((prev) =>
                      prev.find((t) => t.id === target.id)
                        ? prev.filter((t) => t.id !== target.id)
                        : [...prev, target]
                    )
                  }
                />
                <div className="w-full flex gap-1 justify-center items-center px-2">
                  {target.name}
                  <div className="w-full flex gap-1 text-sm">{target.endpoint}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="flex w-full flex-col justify-center items-center gap-2">
        <textarea
          onChange={(e) => setSelectedText(e.target.value)}
          value={selectedText}
          className="w-full p-2 rounded-xl"
          rows={7}
        />
        {selectedTargets.length > 0 && (
          <button
            className=""
            onClick={() => {
              makeFetchRequest(selectedTargets?.[0]);
            }}>
            publish
          </button>
        )}
      </div>
    </div>
  );
}
