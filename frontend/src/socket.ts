import { reactive } from "vue";
import { io } from "socket.io-client";
import {APISettings} from "./utils/apiurls";

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
    stateSocket.ennemyAppearEvents.push(arg.data);
    setTimeout(() => {
        stateSocket.ennemyAppearEvents.pop();
    }, 2000);
});