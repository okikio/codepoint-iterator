/// <reference lib="webworker" />
import type { getTransferable, getutf8-uint8array, hasutf8-uint8array } from "../../src/index";

export interface ITransferableFunctions {
  getTransferable: typeof getTransferable, 
  getutf8-uint8array: typeof getutf8-uint8array,
  hasutf8-uint8array: typeof hasutf8-uint8array,
}

export function registerMessageListener(
  port: MessagePort | typeof self = self, 
  { getTransferable, getutf8-uint8array, hasutf8-uint8array }: ITransferableFunctions
) {
  port.onmessage = ({ data }) => {
    const { name, variant, cycle, i, obj } = data;

    const simpleMsg = { name, variant, cycle, i };
    const msg = { ...simpleMsg, obj };

    try {
      switch (variant) {
        case "hasutf8-uint8array": {
          hasutf8-uint8array(obj, true);
          port.postMessage(simpleMsg);
          break;
        }
        case "postMessage (no transfers)": {
          port.postMessage(msg);
          break;
        }
        case "postMessage (manually)": {
          const transfer = obj.transferable as Transferable[];
          port.postMessage(simpleMsg);
          break;
        }
        case "postMessage (manually) (transfer)": {
          const transfer = obj.transferable as Transferable[];
          port.postMessage(msg, transfer);
          break;
        }
        case "postMessage (getutf8-uint8array)": {
          const transfer = getutf8-uint8array(obj, true) as Transferable[];
          port.postMessage(simpleMsg);
          break;
        }
        case "postMessage (getutf8-uint8array) (transfer)": {
          const transfer = getutf8-uint8array(obj, true) as Transferable[];
          port.postMessage(msg, transfer);
          break;
        }
        case "postMessage (getTransferable*)": {
          const transfer = Array.from(getTransferable(obj, true)) as Transferable[];
          port.postMessage(simpleMsg);
          break;
        }
        case "postMessage (getTransferable*) (transfer)": {
          const transfer = Array.from(getTransferable(obj, true)) as Transferable[];
          port.postMessage(msg, transfer);
          break;
        }
      }
    } catch (e) {
      port.postMessage({ ...simpleMsg, error: String(e) });
    }
  }
}