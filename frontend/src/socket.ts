import { reactive } from "vue";
import { io } from "socket.io-client";

export const stateSocket = reactive({
  connected: false,
  ennemyAppearEvents: new Array<any>
});

export const socket = io("http://localhost:8000");

socket.on("connect", () => {
    stateSocket.connected = true;
});

socket.on("disconnect", () => {
    stateSocket.connected = false;
});

socket.on("ennemyAppear", (...args) => {
    stateSocket.ennemyAppearEvents.push(args);
    setTimeout(() => {
        stateSocket.ennemyAppearEvents.pop();
    }, 2000)
});