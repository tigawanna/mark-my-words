import * as vscode from "vscode";
import { commands, ExtensionContext } from "vscode";
import { MainPanel } from "./views/panel";
import { ConfigurationManager } from "./utils/config-manager.ts";

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
    vscode.commands.registerCommand("markMyWords.openTargets", () => {
      const panel = vscode.window.createWebviewPanel(
        "postTargets",
        "Post Targets",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );

      // Get targets and send to webview
      const targets = ConfigurationManager.getPostTargets();
      panel.webview.postMessage({
        command: "loadTargets",
        targets: targets,
      });

      // Handle messages from webview
      panel.webview.onDidReceiveMessage(
        async (message) => {
          switch (message.command) {
            case "addTarget":
              await ConfigurationManager.addPostTarget(message.target);
              break;
            case "updateTarget":
              await ConfigurationManager.updatePostTarget(message.targetId, message.target);
              break;
            case "deleteTarget":
              await ConfigurationManager.deletePostTarget(message.targetId);
              break;
          }
        },
        undefined,
        context.subscriptions
      );
    })
  );

  context.subscriptions.push(
    commands.registerCommand("markMyWords.startMark", async () => {
      MainPanel.render(context);
    })
  );
  
  context.subscriptions.push(
    vscode.commands.registerCommand("markMyWords.askToken", async () => {
      // Add command to the extension context
      const secrets: vscode.SecretStorage = context.secrets;
      let userToken = await secrets.get("my-token");
      if (!userToken) {
        userToken = await vscode.window.showInputBox({
          title: "Enter your API token",
          password: true,
        });
        if (!userToken) {
          vscode.window.showErrorMessage("Token not entered");
          return;
        }
        await secrets.store("my-token", userToken);
      }
      vscode.window.showInformationMessage(`Token: ${userToken}`);
      console.log("User token", userToken);
    })
  );
  // Register the command to highlight and publish Markdown
  context.subscriptions.push(
    vscode.commands.registerCommand("markMyWords.publishMarkdown", () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        // Get the selected text
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        // Highlight the selected text
        editor.revealRange(selection);
        editor.selection = new vscode.Selection(selection.start, selection.end);

        // Publish the selected text (implement your publishing logic here)
        // publishMarkdown(selectedText);
        vscode.window.showInformationMessage("Markdown published");
        vscode.window.showInformationMessage(selectedText);
      }

      // Show an error message if no text is selected
      else {
        vscode.window.showErrorMessage("No text selected");
      }
    })
  );
}

export function deactivate() {}
