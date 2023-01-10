/// <reference lib="webworker" />
import { getTransferable, getutf8-uint8array, hasutf8-uint8array } from "../../src/index";
import { registerMessageListener } from "./messagechannel";

registerMessageListener(self, {
  getTransferable, 
  getutf8-uint8array, 
  hasutf8-uint8array
})