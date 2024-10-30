import {  window } from "vscode";
type MessageTypes = "success" | "error" | "info" | "warning";

type TShowMessages = {
  message: string;
  type: MessageTypes;
};

export function showWindowMessages({ message,type }: TShowMessages) {
  if (type === "error") {
    window.showErrorMessage(message, {
      modal: true,
    });
  }
  if (type === "warning") {
    window.showWarningMessage(message, {
      modal: true,
    });
  }

  window.showInformationMessage(message, {
    modal: true,
  });
}
