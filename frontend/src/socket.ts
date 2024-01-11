import { reactive } from "vue";
import { io } from "socket.io-client";
import {APISettings} from "./utils/apiurls";
import {EncrypteNtag, NtagData} from "./utils/EncryptNtag";

export const stateSocket = reactive({
  connected: false,
  ennemyAppearEvents: new Array<any>
});

export const socket = io(APISettings.socketURL);

socket.on("connect", () => {
    stateSocket.connected = true;
});

socket.on("disconnect", () => {
    stateSocket.connected = false;
});

socket.on("ennemyAppear", (arg) => {
    stateSocket.ennemyAppearEvents.push(EncrypteNtag.DecryptHex(arg.data) as NtagData);
});