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

  public static async addPublishTarget(target: PostTarget): Promise<PostTarget[]> {
    try {
      const currentTargets = this.getPublishTargets();
      const updatedTargets = [...currentTargets, target];

      await vscode.workspace
        .getConfiguration()
        .update(this.CONFIG_KEY, updatedTargets, vscode.ConfigurationTarget.Global);
      return this.getPublishTargets();
    } catch (error) {
      vscode.window.showErrorMessage(" Something went wrong adding " + (error as Error).message);
      return this.getPublishTargets();
    }
  }

  public static async updatePublishTarget(
    targetId: string,
    updatedTarget: PostTarget
  ): Promise<PostTarget[]> {
    try {
      const currentTargets = this.getPublishTargets();
      const targetIndex = currentTargets.findIndex((t) => t.id === targetId);

      if (targetIndex === -1) {
        throw new Error(`Target with ID ${targetId} not found`);
      }

      currentTargets[targetIndex] = updatedTarget;

      await vscode.workspace
        .getConfiguration()
        .update(this.CONFIG_KEY, currentTargets, vscode.ConfigurationTarget.Global);
      return this.getPublishTargets();
    } catch (error) {
      vscode.window.showErrorMessage(" Something went wrong updating " + (error as Error).message);
      return this.getPublishTargets();
    }
  }

  public static async deletePublishTarget(targetId: string): Promise<PostTarget[]> {
    try {
      const currentTargets = this.getPublishTargets();
      const updatedTargets = currentTargets.filter((t) => t.id !== targetId);

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
    case "getPublishTargets":
      const currentTargets = ConfigurationManager.getPublishTargets();
      await panel.webview.postMessage({
        type: "publishTargets",
        data: currentTargets,
      });
      break;

    case "addPublishTarget":
      const addedTargets = await ConfigurationManager.addPublishTarget(message.data);
      await panel.webview.postMessage({
        type: "publishTargets",
        data: addedTargets,
      });
      break;

    case "updatePublishTarget":
      const targetsAfterUpdate = await ConfigurationManager.updatePublishTarget(
        message.data.id,
        message.data.target
      );
      await panel.webview.postMessage({
        type: "publishTargets",
        data: targetsAfterUpdate,
      });
      break;

    case "deletePublishTarget":
      const targetsAfterDelete = await ConfigurationManager.deletePublishTarget(message.data);
      await panel.webview.postMessage({
        type: "publishTargets",
        data: targetsAfterDelete,
      });
      break;
  }
}
