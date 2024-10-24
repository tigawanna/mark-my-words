// selectionStore.ts
export class SelectionStore {
  private static selectedText: string = "";



  static setSelectedText(text: string) {
    this.selectedText = text;
  }

  static getSelectedText(): string {
    const text = this.selectedText;
    this.selectedText = ""; // Clear after getting
    return text;
  }

  static clear() {
    this.selectedText = "";
  }
}
