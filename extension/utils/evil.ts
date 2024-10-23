// src/configuration.ts
import * as vscode from "vscode";

export interface PostTarget {
  id: string;
  name: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers: Record<string, string>;
  type?: string;
}

export class ConfigurationManager {
  private static readonly CONFIG_KEY = "markMyWords.postTargets";

  public static getPostTargets(): PostTarget[] {
    const config = vscode.workspace.getConfiguration();
    return config.get<PostTarget[]>(this.CONFIG_KEY) || [];
  }

  public static async addPostTarget(target: PostTarget): Promise<void> {
    const currentTargets = this.getPostTargets();
    const updatedTargets = [...currentTargets, target];

    await vscode.workspace
      .getConfiguration()
      .update(this.CONFIG_KEY, updatedTargets, vscode.ConfigurationTarget.Global);
  }

  public static async updatePostTarget(targetId: string, updatedTarget: PostTarget): Promise<void> {
    const currentTargets = this.getPostTargets();
    const targetIndex = currentTargets.findIndex((t) => t.id === targetId);

    if (targetIndex === -1) {
      throw new Error(`Target with ID ${targetId} not found`);
    }

    currentTargets[targetIndex] = updatedTarget;

    await vscode.workspace
      .getConfiguration()
      .update(this.CONFIG_KEY, currentTargets, vscode.ConfigurationTarget.Global);
  }

  public static async deletePostTarget(targetId: string): Promise<void> {
    const currentTargets = this.getPostTargets();
    const updatedTargets = currentTargets.filter((t) => t.id !== targetId);

    await vscode.workspace
      .getConfiguration()
      .update(this.CONFIG_KEY, updatedTargets, vscode.ConfigurationTarget.Global);
  }
}

// src/MainPanel.ts
// import { Disposable, ExtensionContext, ViewColumn, WebviewPanel, window } from "vscode";
// import { WebviewHelper } from "./helper";
// import { ConfigurationManager, PostTarget } from "./configuration";

// export class MainPanel {
//   public static currentPanel: MainPanel | undefined;
//   private readonly _panel: WebviewPanel;
//   private _disposables: Disposable[] = [];

//   private constructor(panel: WebviewPanel, context: ExtensionContext) {
//     this._panel = panel;

//     this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
//     this._panel.webview.html = WebviewHelper.setupHtml(this._panel.webview, context);

//     // Setup message handling
//     this._panel.webview.onDidReceiveMessage(
//       async (message) => {
//         switch (message.type) {
//           case "getTargets":
//             const targets = ConfigurationManager.getPostTargets();
//             this._panel.webview.postMessage({
//               type: "targetsLoaded",
//               data: targets,
//             });
//             break;
//           case "addTarget":
//             await ConfigurationManager.addPostTarget(message.data);
//             this._panel.webview.postMessage({
//               type: "targetAdded",
//               data: message.data,
//             });
//             break;
//           case "updateTarget":
//             await ConfigurationManager.updatePostTarget(message.data.id, message.data.target);
//             this._panel.webview.postMessage({
//               type: "targetUpdated",
//               data: message.data.target,
//             });
//             break;
//           case "deleteTarget":
//             await ConfigurationManager.deletePostTarget(message.data);
//             this._panel.webview.postMessage({
//               type: "targetDeleted",
//               data: message.data,
//             });
//             break;
//         }
//       },
//       null,
//       this._disposables
//     );

//     WebviewHelper.setupWebviewHooks(this._panel.webview, this._disposables);
//   }

//   public static render(context: ExtensionContext) {
//     if (MainPanel.currentPanel) {
//       MainPanel.currentPanel._panel.reveal(ViewColumn.One);
//     } else {
//       const panel = window.createWebviewPanel("markMyWords", "Mark My Words", ViewColumn.One, {
//         enableScripts: true,
//       });

//       MainPanel.currentPanel = new MainPanel(panel, context);
//     }

//     // Load and send initial targets data
//     const targets = ConfigurationManager.getPostTargets();
//     MainPanel.currentPanel._panel.webview.postMessage({
//       type: "targetsLoaded",
//       data: targets,
//     });
//   }

//   public dispose() {
//     MainPanel.currentPanel = undefined;
//     this._panel.dispose();

//     while (this._disposables.length) {
//       const disposable = this._disposables.pop();
//       if (disposable) {
//         disposable.dispose();
//       }
//     }
//   }
// }

