// MainPanel.ts
import { Disposable, ExtensionContext, ViewColumn, WebviewPanel, window } from "vscode";
import { WebviewHelper } from "./helper";
import { ConfigurationManager } from "../utils/config-manager.ts";


export class MainPanel {
  public static currentPanel: MainPanel | undefined;
  private readonly _panel: WebviewPanel;
  public publicPanel: WebviewPanel;
  private _disposables: Disposable[] = [];

  private constructor(panel: WebviewPanel, context: ExtensionContext) {
    this._panel = panel;
    this.publicPanel = panel;
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.webview.html = WebviewHelper.setupHtml(this._panel.webview, context);

    // Setup message handling
    this._panel.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.type) {
          case "ready":
            const targets = ConfigurationManager.getPostTargets();
            await this._panel.webview.postMessage({
              type: "initialData",
              data: {
                // selectedText,
                targets,
              },
            });
            break;

          case "getTargets":
            const currentTargets = ConfigurationManager.getPostTargets();
            await this._panel.webview.postMessage({
              type: "targetsLoaded",
              data: currentTargets,
            });
            break;

          case "addTarget":
            await ConfigurationManager.addPostTarget(message.data);
            await this._panel.webview.postMessage({
              type: "targetAdded",
              data: message.data,
            });
            break;

          case "updateTarget":
            await ConfigurationManager.updatePostTarget(message.data.id, message.data.target);
            await this._panel.webview.postMessage({
              type: "targetUpdated",
              data: message.data.target,
            });
            break;

          case "deleteTarget":
            await ConfigurationManager.deletePostTarget(message.data);
            await this._panel.webview.postMessage({
              type: "targetDeleted",
              data: message.data,
            });
            break;
        }
      },
      null,
      this._disposables
    );
  }

  public static async render(context: ExtensionContext) {
    const editor = window.activeTextEditor;
    const selection = editor?.selection;
    const selectedText = editor?.document?.getText(selection) || "";

    const immediate_message = {
      selectedText,
      targets: ConfigurationManager.getPostTargets(),
    };

    const panel = window.createWebviewPanel("markMyWords", "Mark My Words", ViewColumn.One, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });
    //  send initial data
    await panel.webview.postMessage({
      type: "immediate",
      data: immediate_message,
    });

    // Dispose the old panel if it exists to avoid multiple instances
    if (MainPanel.currentPanel) {
      MainPanel.currentPanel.dispose();
    }
    MainPanel.currentPanel = new MainPanel(panel, context);
    // Post a message to the webview immediately after creating it
  }

  public dispose() {
    MainPanel.currentPanel = undefined;
    this._panel.dispose();
    // SelectionStore.clear(); // Clear the store when panel is disposed

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

}
