import { reactive } from "vue";
import { io } from "socket.io-client";
import {APISettings} from "./utils/apiurls";
import {EncrypteNtag, NtagData} from "./utils/EncryptNtag";
import {IDictionary} from "./utils/helpers";
import {
    COMPRESS_VISIBILITY_DEFAULT,
    CompressedVisibility, CompressVisibility,
    VISIBILITY_DEFAULT,
    VisibilityEntity,
    VisibilityEntityBuilder
} from "./utils/Types/Entity";

interface StateSocket {
    connected: boolean;
    ennemyAppearEvents: Array<NtagData>;
    visibilityChangeEvents: IDictionary<VisibilityEntity>;
}

export const stateSocket = reactive<StateSocket>({
    connected: false,
    ennemyAppearEvents: new Array<NtagData>,
    visibilityChangeEvents: {},
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

    if (!stateSocket.visibilityChangeEvents[stateSocket.ennemyAppearEvents.length-1]) {
        stateSocket.visibilityChangeEvents[stateSocket.ennemyAppearEvents.length-1] = VISIBILITY_DEFAULT;
    }
});

socket.on("visibilityChange", (arg) => {
    if (stateSocket.visibilityChangeEvents[arg.entityIndex]) {
        stateSocket.visibilityChangeEvents[arg.entityIndex] = VisibilityEntityBuilder(arg, CompressVisibility(stateSocket.visibilityChangeEvents[arg.entityIndex]))
    }
    else {
        stateSocket.visibilityChangeEvents[arg.entityIndex] = VisibilityEntityBuilder(arg, COMPRESS_VISIBILITY_DEFAULT);
    }
});