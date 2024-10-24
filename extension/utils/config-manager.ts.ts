// src/configuration.ts
import * as vscode from 'vscode';

export interface PostTarget {
    id: string;
    name: string;
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers: Record<string, string>;
    body?:Record<string, string>;
}

export class ConfigurationManager {
  private static readonly CONFIG_KEY = "markMyWords.postTargets";

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




