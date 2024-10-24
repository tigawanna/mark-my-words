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
      MainPanel.render(context);
    })
  );

  // Register command that will open webview with selected text

}





export function deactivate() {}
