/// <reference lib="webworker" />
import { getTransferable, getutf8-uint8array, hasutf8-uint8array } from "../../src/index.ts";
import { registerMessageListener } from "./messagechannel.ts";

registerMessageListener(self, {
  getTransferable,
  getutf8-uint8array,
  hasutf8-uint8array
})