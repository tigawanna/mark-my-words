// src/configuration.ts
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

  public static getPostTargets(): PostTarget[] {
    const config = vscode.workspace.getConfiguration();
    return config.get<PostTarget[]>(this.CONFIG_KEY) || [];
  }

  public static async addPostTarget(target: PostTarget): Promise<void> {
    try {
      const currentTargets = this.getPostTargets();
      const updatedTargets = [...currentTargets, target];

      await vscode.workspace
        .getConfiguration()
        .update(this.CONFIG_KEY, updatedTargets, vscode.ConfigurationTarget.Global);
    } catch (error) {
      vscode.window.showErrorMessage(" Something went wrong adding " + (error as Error).message);
    }
  }

  public static async updatePostTarget(targetId: string, updatedTarget: PostTarget): Promise<void> {
    try {
      const currentTargets = this.getPostTargets();
      const targetIndex = currentTargets.findIndex((t) => t.id === targetId);

      if (targetIndex === -1) {
        throw new Error(`Target with ID ${targetId} not found`);
      }

      currentTargets[targetIndex] = updatedTarget;

      await vscode.workspace
        .getConfiguration()
        .update(this.CONFIG_KEY, currentTargets, vscode.ConfigurationTarget.Global);
    } catch (error) {
      vscode.window.showErrorMessage(" Something went wrong updating " + (error as Error).message);
    }
  }

  public static async deletePostTarget(targetId: string): Promise<void> {
    try {
      const currentTargets = this.getPostTargets();
      const updatedTargets = currentTargets.filter((t) => t.id !== targetId);

      await vscode.workspace
        .getConfiguration()
        .update(this.CONFIG_KEY, updatedTargets, vscode.ConfigurationTarget.Global);
    } catch (error) {
      vscode.window.showErrorMessage(" Something went wrong deleting " + (error as Error).message);
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
    case "getTargets":
      const currentTargets = ConfigurationManager.getPostTargets();
      await panel.webview.postMessage({
        type: "targetsLoaded",
        data: currentTargets,
      });
      break;

    case "addTarget":
      await ConfigurationManager.addPostTarget(message.data);
      await panel.webview.postMessage({
        type: "targetAdded",
        data: message.data,
      });
      break;

    case "updateTarget":
      await ConfigurationManager.updatePostTarget(message.data.id, message.data.target);
      await panel.webview.postMessage({
        type: "targetUpdated",
        data: message.data.target,
      });
      break;

    case "deleteTarget":
      await ConfigurationManager.deletePostTarget(message.data);
      await panel.webview.postMessage({
        type: "targetDeleted",
        data: message.data,
      });
      break;
  }
}
