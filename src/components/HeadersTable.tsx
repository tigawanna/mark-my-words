import "@vscode-elements/elements/dist/vscode-icon";
interface HeadersTableProps {
  headers: Record<string, string>;
}

export function HeadersTable({}: HeadersTableProps) {
  return (
    <div className="w-full h-full flex flex-col text-vscode-contrastActiveBorder items-center justify-center">
      <div className="codicon codicon-add"></div>
      <vscode-icon name="loading" size={64} spin spin-duration="1"></vscode-icon>
    </div>
  );
}
