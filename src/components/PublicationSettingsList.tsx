import type { PostTarget } from "../../extension/utils/config-manager.ts.ts";
import { vscode } from "../utils/vscode.ts";

interface PublicationSettingsListProps {
  targets: PostTarget[];
  setTargets: React.Dispatch<React.SetStateAction<PostTarget[]>>;
}

export function PublicationSettingsList({ targets }: PublicationSettingsListProps) {
  const handleDeleteTarget = (id: string) => {
    vscode.postMessage({
      type: "deleteTarget",
      data: id,
    });
  };

  return (
    <div className="flex min-w-[60%] flex-col  justify-center items-center gap-2">
      <h2 className="text-2xl font-bold">Configured Targets</h2>
      {targets.length === 0 ? (
        <p className="empty-message">No targets configured yet</p>
      ) : (
        <ul className="w-full flex flex-wrap p-2 gap-2">
          {targets.map((target) => (
            <li key={target.id} className="flex max-w-[45%] p-2 bg-vscode-editorGroup-dropBackground">
              <div className="flex flex-col gap-1 p-2">
                <h3 className="text-2xl font-bold">{target.name}</h3>
                <p className="text-lg">{target.endpoint}</p>
                <p className="target-method">Method: {target.method}</p>
                {Object.entries(target.headers).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <p className="headers-title">Headers:</p>
                    {Object.entries(target.headers).map(([key, value]) => (
                      <p key={key} className="border rounded-lg px-2">
                        {key}: {value}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => handleDeleteTarget(target.id)} className="size-8">
              x
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
