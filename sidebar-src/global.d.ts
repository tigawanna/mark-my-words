import { DOMAttributes, MutableRefObject } from "react";
// Import custom element definition classes
import {
  VscodeButton,
  VscodeTabHeader,
  VscodeTabPanel,
  VscodeTabs,
  VscodeBadge,
  VscodeSingleSelect,
  VscodeOption,
  VscodeIcon,
  VscodeTable,
  VscodeTableHeader,
  VscodeTableHeaderCell,
  VscodeTableBody,
  VscodeTableRow,
  VscodeTableCell,

} from "@vscode-elements/elements";

type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: any } & MutableRefObject>;

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      ["vscode-button"]: CustomElement<VscodeButton>;
      ["vscode-tabs"]: CustomElement<VscodeTabs>;
      ["vscode-tab-header"]: CustomElement<VscodeTabHeader>;
      ["vscode-tab-panel"]: CustomElement<VscodeTabPanel>;
      ["vscode-badge"]: CustomElement<VscodeBadge>;
      ["vscode-single-select"]: CustomElement<VscodeSingleSelect>;
      ["vscode-option"]: CustomElement<VscodeOption>;
      ["vscode-icon"]: CustomElement<VscodeIcon>;
      ["vscode-table"]: CustomElement<VscodeTable>;
      ["vscode-table-header"]: CustomElement<VscodeTableHeader>;
      ["vscode-table-header-cell"]: CustomElement<VscodeTableHeaderCell>;
      ["vscode-table-body"]: CustomElement<VscodeTableBody>;
      ["vscode-table-row"]: CustomElement<VscodeTableRow>;
      ["vscode-table-cell"]: CustomElement<VscodeTableCell>;
    }
  }
}
