
import {TShowMessages} from "../../extension/utils/info-messages";
import { vscode } from "./vscode";
export function postInformMessages({ message,type }: TShowMessages) {
 vscode.postMessage({type:"inform", data:{ message, type }});
}
