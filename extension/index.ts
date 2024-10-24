import * as vscode from "vscode";
import { commands, ExtensionContext } from "vscode";
import { MainPanel } from "./views/configure-panel";
import { SelectionStore } from "./stores/selection-strore";

interface PostTarget {
  id: string;
  name: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers: Record<string, string>;
  type?: string;
}

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand("markMyWords.publishSelected", async () => {
      // Capture the current selection before opening the panel
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        SelectionStore.setSelectedText(selectedText);
      }
      MainPanel.render(context);
    })
  );

  // Register command that will open webview with selected text

}





export function deactivate() {}
