// App.tsx
import { vscode } from "./utils/vscode";
import { useEffect, useState } from "react";
import type { PostTarget } from "../extension/utils/config-manager.ts";


function App() {
  const [targets, setTargets] = useState<PostTarget[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    endpoint: "",
    method: "POST" as PostTarget["method"],
    headers: {} as Record<string, string>,
  });

  const [headerKey, setHeaderKey] = useState("");
  const [headerValue, setHeaderValue] = useState("");

  useEffect(() => {
    vscode.postMessage({ type: "getTargets" });

    const messageListener = (event: MessageEvent) => {
      const message = event.data;
      switch (message.type) {
        case "targetsLoaded":
          setTargets(message.data);
          break;
        case "targetAdded":
          setTargets((prev) => [...prev, message.data]);
          break;
        case "targetDeleted":
          setTargets((prev) => prev.filter((t) => t.id !== message.data));
          break;
        case "targetUpdated":
          setTargets((prev) => prev.map((t) => (t.id === message.data.id ? message.data : t)));
          break;
      }
    };

    window.addEventListener("message", messageListener);
    return () => window.removeEventListener("message", messageListener);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTarget: PostTarget = {
      id: crypto.randomUUID(),
      ...formData,
    };

    vscode.postMessage({
      type: "addTarget",
      data: newTarget,
    });

    setFormData({
      name: "",
      endpoint: "",
      method: "POST",
      headers: {},
    });
    setHeaderKey("");
    setHeaderValue("");
  };

  const handleAddHeader = () => {
    if (headerKey && headerValue) {
      setFormData((prev) => ({
        ...prev,
        headers: {
          ...prev.headers,
          [headerKey]: headerValue,
        },
      }));
      setHeaderKey("");
      setHeaderValue("");
    }
  };

  const handleDeleteTarget = (id: string) => {
    vscode.postMessage({
      type: "deleteTarget",
      data: id,
    });
  };

  return (
    <main className="w-full flex flex-col justify-center items-center gap-2 p-5">
      <h1 className="text-4xl font-bold">Publication Target Configuration</h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-2">
        {/* Target List */}
        <div className="flex flex-col bg-vscode-editorGroup-dropBackground justify-center items-center gap-2">
          <h2 className="text-2xl font-bold">Configured Targets</h2>
          {targets.length === 0 ? (
            <p className="empty-message">No targets configured yet</p>
          ) : (
            <ul className="target-list">
              {targets.map((target) => (
                <li key={target.id} className="target-item">
                  <div className="target-content">
                    <div className="target-info">
                      <h3 className="target-name">{target.name}</h3>
                      <p className="target-endpoint">{target.endpoint}</p>
                      <p className="target-method">Method: {target.method}</p>
                      {Object.entries(target.headers).length > 0 && (
                        <div className="target-headers">
                          <p className="headers-title">Headers:</p>
                          {Object.entries(target.headers).map(([key, value]) => (
                            <p key={key} className="header-item">
                              {key}: {value}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                    <button onClick={() => handleDeleteTarget(target.id)} className="delete-button">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add Target Form */}
        <div className="panel">
          <h2 className="panel-title">Add New Target</h2>
          <form onSubmit={handleFormSubmit} className="form">
            <div className="form-group">
              <label className="form-label">
                Name:
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="form-input"
                  required
                />
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">
                Endpoint:
                <input
                  type="url"
                  value={formData.endpoint}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endpoint: e.target.value }))}
                  className="form-input"
                  required
                />
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">
                Method:
                <select
                  value={formData.method}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      method: e.target.value as PostTarget["method"],
                    }))
                  }
                  className="form-select">
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </label>
            </div>

            {/* Headers Section */}
            <div className="headers-section">
              <h3 className="headers-section-title">Headers</h3>
              <div className="header-inputs">
                <input
                  type="text"
                  placeholder="Header Key"
                  value={headerKey}
                  onChange={(e) => setHeaderKey(e.target.value)}
                  className=""
                />
                <input
                  type="text"
                  placeholder="Header Value"
                  value={headerValue}
                  onChange={(e) => setHeaderValue(e.target.value)}
                  className=""
                />
                <button type="button" onClick={handleAddHeader} className="add-header-button">
                  Add
                </button>
              </div>

              {/* Display current headers */}
              {Object.entries(formData.headers).length > 0 && (
                <div className="current-headers">
                  {Object.entries(formData.headers).map(([key, value]) => (
                    <div key={key} className="header-row">
                      <span>
                        {key}: {value}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const newHeaders = { ...formData.headers };
                          delete newHeaders[key];
                          setFormData((prev) => ({ ...prev, headers: newHeaders }));
                        }}
                        className="remove-header-button">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="submit-button">
              Add Target
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default App;
