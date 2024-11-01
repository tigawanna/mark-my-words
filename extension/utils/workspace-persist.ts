import * as vscode from "vscode";
import { WebviewPanel } from "vscode";

export interface PostTarget {
  id: string;
  name: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers: Record<string, string>;
  body: Record<string, string>;
}

export class ConfigurationManager {
  private static readonly CONFIG_KEY = "markMyWords.publishTargets";
  // add a publish target variab;e that will be mutated on every operation
  // remember to add to package.json
  // "configuration": {
  //   "title": "Mark My Words",
  //   "properties": {
  //     "properties": {
  //       "markMyWords.publishTargets":{
  //         "type": "array",
  //         "default": [],
  //         "description": "Configured publish targets"
  //       }
  //     },}

  public static getPublishTargets(): PostTarget[] {
    const config = vscode.workspace.getConfiguration();
    return config.get<PostTarget[]>(this.CONFIG_KEY) || [];
  }

  public static async addPublishTarget(target: PostTarget, targets?: PostTarget[]): Promise<void> {
    try {
      const updatedTargets = [...(targets ?? []), target];
      await vscode.workspace
        .getConfiguration()
        .update(this.CONFIG_KEY, updatedTargets, vscode.ConfigurationTarget.Global);
      // return this.getPublishTargets();
    } catch (error) {
      vscode.window.showErrorMessage(" Something went wrong adding " + (error as Error).message);
      // return this.getPublishTargets();
    }
  }

  public static async updatePublishTarget(
    targetIndex: number,
    target: PostTarget,
    targets: PostTarget[]
  ): Promise<void> {
    try {
      targets[targetIndex] = target;
      await vscode.workspace
        .getConfiguration()
        .update(this.CONFIG_KEY, targets, vscode.ConfigurationTarget.Global);
    } catch (error) {
      vscode.window.showErrorMessage(" Something went wrong updating " + (error as Error).message);
    }
  }
  public static async handleSubmitPublishTarget(target: PostTarget) {
    try {
      if (!target) {
        return;
      }
      const currentTargets = this.getPublishTargets();
      if (!target.id) {
        return this.addPublishTarget(target, currentTargets);
      }
      const targetIndex = currentTargets.findIndex((t) => t.id === target?.id);
      // create new
      if (targetIndex === -1) {
        return this.addPublishTarget(target);
      }
      return this.updatePublishTarget(targetIndex, target, currentTargets);
    } catch (error) {
      vscode.window.showErrorMessage(
        " Something went wrong submitting " + (error as Error).message
      );
      // return this.getPublishTargets();
    }
  }

  public static async deletePublishTarget(target: PostTarget) {
    try {
      if (!target || !target.id) {
        return;
      }
      const currentTargets = this.getPublishTargets();
      const updatedTargets = currentTargets.filter((t) => t.id !== target?.id);
      await vscode.workspace
        .getConfiguration()
        .update(this.CONFIG_KEY, updatedTargets, vscode.ConfigurationTarget.Global);
      return this.getPublishTargets();
    } catch (error) {
      vscode.window.showErrorMessage(" Something went wrong deleting " + (error as Error).message);
      return this.getPublishTargets();
    }
  }
}

export async function workSpacePersistSwitch({
  panel,
  message,
}: {
  panel: WebviewPanel;
  message: {
    type: string;
    data: any;
  };
}) {
  switch (message.type) {
    case "handleSubmittedPublishTargets":
      await ConfigurationManager.handleSubmitPublishTarget(message.data);
      break;
    case "deletePublishTargets":
      await ConfigurationManager.deletePublishTarget(message.data);
      break;
    case "getPublishTargets":
      const currentTargets = ConfigurationManager.getPublishTargets();
      await panel.webview.postMessage({
        type: "publishTargets",
        data: currentTargets,
      });
      break;
  }
}
