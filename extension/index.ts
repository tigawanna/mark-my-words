import  * as vscode from 'vscode';
import { commands, ExtensionContext } from 'vscode';
import { MainPanel } from './views/panel';

export function activate(context: ExtensionContext) {
  // Add command to the extension context
  context.subscriptions.push(
    commands.registerCommand("mark-my-words.startMark", async () => {
      MainPanel.render(context);
    })
  );
  // Register the command to highlight and publish Markdown
  context.subscriptions.push(
    vscode.commands.registerCommand("mark-my-words.publishMarkdown", () => {
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
