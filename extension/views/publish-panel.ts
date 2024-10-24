import path from "path";
import * as vscode from "vscode";
export function activatePanelTwo(context: vscode.ExtensionContext) {
  // Create a webview panel
  const panel = vscode.window.createWebviewPanel(
    "myExtension",
    "My Extension",
    vscode.ViewColumn.Two,
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, "dist"))],
    }
  );

  // Set the initial HTML content for the webview
  panel.webview.html = `<!DOCTYPE html>
<html>
<head>
<title>My Extension</title>
</head>
<body>
    <div id="selected-text"></div>
    <script>
        window.addEventListener('message', (event) => {
            const message = event.data;
            if (message.type === 'selectedText') {
                document.getElementById('selected-text').textContent = message.text;
            }
        });
    </script>
</body>
</html>`;

  // Register a command to send the selected text to the webview
  return vscode.commands.registerCommand("markMyWords.selectStuff", () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);
      panel.webview.postMessage({
        type: "selectedText",
        text: selectedText,
      });
    }
  });
}

