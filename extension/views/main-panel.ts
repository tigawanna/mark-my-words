import {
  Disposable,
  ExtensionContext,
  TextEditorSelectionChangeEvent,
  ViewColumn,
  WebviewPanel,
  window,
} from "vscode";
import { WebviewHelper } from "./helper";
import { showWindowMessages } from "@extension/utils/messages";

export class MainPanel {
  public static currentPanel: MainPanel | undefined;
  private readonly _panel: WebviewPanel;
  public publicPanel: WebviewPanel;
  private _disposables: Disposable[] = [];
  private _selectionChangeListener: Disposable | undefined;
  private _initialText: string;

  private constructor(panel: WebviewPanel, context: ExtensionContext, initialText: string) {
    this._panel = panel;
    this.publicPanel = panel;
    this._initialText = initialText;

    // Set up disposal handling
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Initialize the webview content
    this._panel.webview.html = WebviewHelper.setupHtml(this._panel.webview, context);

    // Set up selection change listener
    this._selectionChangeListener = window.onDidChangeTextEditorSelection(
      this._handleSelectionChange.bind(this)
    );
    this._disposables.push(this._selectionChangeListener);

    // Setup message handling
    this._panel.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.type) {
          case "ready":
            if (this._initialText.length > 0) {
              try {
                await this._panel.webview.postMessage({
                  type: "selectedText",
                  data: {
                    selectedText: this._initialText,
                  },
                });
              } catch (error) {
                console.error("Error sending initial text:", error);
              }
            }
            break;
          //  case "inform":
          //   showWindowMessages(message.data); 
          //  break;
        }
      },
      null,
      this._disposables
    );
  }

  private async _handleSelectionChange(event: TextEditorSelectionChangeEvent) {
    if (this._panel) {
      const selectedText = this._getCurrentSelectedText();
      try {
        await this._panel.webview.postMessage({
          type: "selectionChanged",
          data: {
            selectedText,
          },
        });
      } catch (error:any) {
        console.error("Error sending selection change:", error);
        window.showErrorMessage("Error sending selection change: ");
      }
    }
  }

  private _getCurrentSelectedText(): string {
    const editor = window.activeTextEditor;
    const selection = editor?.selection;
    return editor?.document?.getText(selection) || "";
  }

  public static async render(context: ExtensionContext) {
    const editor = window.activeTextEditor;
    const selection = editor?.selection;
    const selectedText = editor?.document?.getText(selection) || "";

    const panel = window.createWebviewPanel("markMyWords", "Mark My Words", ViewColumn.Beside, {
      enableScripts: true,
    });

    // Dispose the old panel if it exists to avoid multiple instances
    if (MainPanel.currentPanel) {
      MainPanel.currentPanel.dispose();
    }

    MainPanel.currentPanel = new MainPanel(panel, context, selectedText);
      await MainPanel.currentPanel._panel.webview.postMessage({
        type: "initialSelectedText",
        data: selectedText,
      });

  }

  public dispose() {
    MainPanel.currentPanel = undefined;

    if (this._selectionChangeListener) {
      this._selectionChangeListener.dispose();
    }

    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}
