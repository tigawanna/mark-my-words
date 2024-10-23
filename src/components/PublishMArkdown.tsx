import { useState } from "react";
import type { PostTarget } from "../../extension/utils/config-manager.ts.ts";
import { vscode } from "../utils/vscode.ts";

interface PublishMarkdownProps {
  targets: PostTarget[];
}

export function PublishMarkdown({ targets }: PublishMarkdownProps) {
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
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
                  checked={selectedTargets.includes(target.id)}
                  onChange={() =>
                    setSelectedTargets((prev) =>
                      prev.includes(target.id)
                        ? prev.filter((t) => t !== target.id)
                        : [...prev, target.id]
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
        <textarea className="w-full p-2 rounded-xl" rows={10} />
        <button className="">publish</button>
      </div>
    </div>
  );
}
