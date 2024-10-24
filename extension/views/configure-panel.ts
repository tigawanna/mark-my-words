// MainPanel.ts
import { Disposable, ExtensionContext, ViewColumn, WebviewPanel, window } from "vscode";
import { WebviewHelper } from "./helper";
import { SelectionStore } from "../stores/selection-strore";
import { ConfigurationManager } from "../utils/config-manager.ts";
import * as vscode from "vscode";

export class MainPanel {
  public static currentPanel: MainPanel | undefined;
  private readonly _panel: WebviewPanel;
  public  publicPanel: WebviewPanel;
  private _disposables: Disposable[] = [];

  private constructor(panel: WebviewPanel, context: ExtensionContext) {
    this._panel = panel;
    this.publicPanel = panel;
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    //  const editor = window.activeTextEditor;
    //  const selection = editor?.selection;
    //  const selectedText = editor?.document?.getText(selection) || "";
    // SelectionStore.setSelectedText(selectedText);
    // Set up the initial HTML
    this._panel.webview.html = WebviewHelper.setupHtml(this._panel.webview, context);

 
    // Setup message handling
    this._panel.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.type) {
          case "ready":
            const selectedText = SelectionStore.getSelectedText();
    console.log(
      "=========  SelectionStore.getSelectedText() ====== ",
      SelectionStore.getSelectedText()
    );

            const targets = ConfigurationManager.getPostTargets();

            await this._panel.webview.postMessage({
              type: "initialData",
              data: {
                selectedText,
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
    const immediate_message  = {
        selectedText: SelectionStore.getSelectedText(),
        targets: ConfigurationManager.getPostTargets(),
      }

    const panel = window.createWebviewPanel("markMyWords", "Mark My Words", ViewColumn.One, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });

    try {
      const message  = await panel.webview.postMessage({
        type: "immediate",
        data: immediate_message,
      });
      console.log(" === message insode render function  === ", message);
      
    } catch (error:any) {
      console.log("==== error  message insode render function  ==== ", error.message);
    }
    // If the panel already exists, dispose of the old one and create a new one
    // This is necessary because the panel is not automatically disposed when
    // the user closes it, so we need to do it manually. This also allows us to
    // reuse the same panel ID and avoid creating multiple panels.
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
