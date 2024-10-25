<template>

    <div class="flex flex-col-reverse h-full w-full p-4 font-sansserif text-amber-50 text-sm gap-6">
        <div class="grid grid-cols-10 w-full gap-2">
            <input
                v-model="state.chatMessage"
                @keyup.enter="SendMessage()"
                class="col-span-9 h-5 my-auto rounded border border-slate-200 text-black"
                name="name"
                type="text"
                autocomplete="off"/>
            <ArrowRightIcon
                class="h-6 w-6 rounded-lg bg-white text-black"
                @click="SendMessage()"></ArrowRightIcon>
        </div>
        <div class="flex flex-col w-full gap-1">
            <div
                v-for="(message, messageIndex) in state.messages" :key="messageIndex"
                class="flex">
                <div class="w-fit font-semibold">{{message.name}}: </div>
                <span class="pl-2">{{message.message}}</span>
            </div>
        </div>
    </div>
</template>


<script lang="ts" setup>
import {reactive} from "vue";
import {ArrowRightIcon} from "@heroicons/vue/24/solid";
import {ChatMessage} from "../../utils/Types/ChatMessageType";
import {stateSocket} from "../../socket";
import {APIRequests} from "../../utils/apiurls";

interface State {
    messages: Array<ChatMessage>;
    chatMessage: string;
}
const state = reactive<State>({
    messages: stateSocket.chatMessageEvent,
    chatMessage: ""
})

const SendMessage = async () => {
    if (state.chatMessage.trim().length > 0) {
        await APIRequests.Event.sendMessage("Admin", state.chatMessage).then();
    }

    state.chatMessage = "";
}

</script>