<template>
    <div class="flex flex-col relative h-full w-full justify-center items-center">
        <div id="spectator-screen" class="relative w-full h-[90%]">
            <div class="absolute scale-50 inset-0 -top-[25%] -left-[25%] flex border h-full w-full border-red"
                 ref="specCharacters"
                 @mouseenter.ctrl.exact="hoverCtrl('characters')">
                <div class="absolute z-50 flex h-[10%] w-[85%] right-0 -top-1">
                    <CharacterIcons :characters="state.characters" :players="state.game.players"/>
                </div>
                <Spectator :showState="{identifier: 'PlayerSheet', value: ''}"/>
            </div>
            <div
                class="absolute scale-50 inset-0 -top-[25%] left-[25%] flex border h-full w-full border-red"
                ref="specEntities"
                @mouseenter.ctrl.exact="hoverCtrl('entities')">
                <Spectator :showState="{identifier: 'Entities', value: ''}"/>
            </div>
            <div
                class="absolute scale-50 inset-0 top-[25%] -left-[25%] flex border h-full w-full border-red"
                ref="specScenes"
                @mouseenter.ctrl.exact="hoverCtrl('scenes')">
                <Spectator :showState="{identifier: 'None', value: ''}"/>
            </div>
            <div
                class="absolute scale-50 inset-0 top-[25%] left-[25%] flex border h-full w-full border-red"
                ref="specMap"
                @mouseenter.ctrl.exact="hoverCtrl('map')">
                <Spectator :showState="{identifier: 'None', value: ''}"/>
            </div>
            <div
                v-show="state.currentHover != null && state.currentHover == specRef['characters']?.value"
                class="absolute scale-50 inset-0 -top-[25%] -left-[25%] flex border h-full w-full border-red cursor-pointer bg-white/10"
                @click="APIRequests.Event.sendShowState({identifier: 'PlayerSheet', value:''})"
                @mouseleave="hoverLeave()">
            </div>
            <div
                v-show="state.currentHover != null && state.currentHover == specRef['entities']?.value"
                class="absolute scale-50 inset-0 -top-[25%] left-[25%] flex border h-full w-full border-red cursor-pointer bg-white/10"
                @click="APIRequests.Event.sendShowState({identifier: 'Entities', value:''})"
                @mouseleave="hoverLeave()">
            </div>
            <div
                v-show="state.currentHover != null && state.currentHover == specRef['scenes']?.value"
                class="absolute scale-50 inset-0 top-[25%] -left-[25%] flex border h-full w-full border-red cursor-pointer bg-white/10"
                @click="APIRequests.Event.sendShowState({identifier: 'None', value:''})"
                @mouseleave="hoverLeave()">
            </div>
            <div
                v-show="state.currentHover != null && state.currentHover == specRef['map']?.value"
                class="absolute scale-50 inset-0 top-[25%] left-[25%] flex border h-full w-full border-red cursor-pointer bg-white/10"
                @click="APIRequests.Event.sendShowState({identifier: 'None', value:''})"
                @mouseleave="hoverLeave()">
            </div>
        </div>
        <div id="keeper-screen" class="border-t border-red w-full h-[10%]">
            <button class="rounded bg-amber-50 px-2 m-2" @click="APIRequests.Event.sendTestEnnemy()">Appear</button>
            <button class="rounded bg-amber-50 px-2 m-2" @click="resetEvents()">ResetEvents</button>
            <button class="rounded bg-amber-50 px-2 m-2" @click="APIRequests.Event.sendMessage('Adrahil', 'Jet de dathlétisme ( 1, 6 - 5|12) = 19')">SendMessage</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {APIRequests} from "../utils/apiurls";
import Spectator from "./Spectator.vue";
import {reactive, Ref, ref} from "vue";
import {IDictionary} from "../utils/helpers";
import CharacterIcons from "../components/ComponentsSpectatorSheet/CharacterIcons.vue";
import {GameType} from "../utils/Types/GameType";
import {PlayerType} from "../utils/Types/PlayerType";
import {defaultSocketState, stateSocket} from "../socket";

interface State {
    currentHover: Ref;
    game: GameType;
    characters: IDictionary<PlayerType>;
}

const state = reactive<State>({
    currentHover: ref<HTMLElement | null>(null),
    game: await APIRequests.Games.getGame(),
    characters: await APIRequests.Character.getAllCharacters()
})

const specRef:IDictionary<Ref> = {};
const specCharacters = ref<HTMLElement | null>(null)
const specEntities = ref<HTMLElement | null>(null)
const specScenes = ref<HTMLElement | null>(null)
const specMap = ref<HTMLElement | null>(null)

specRef["characters"] = specCharacters;
specRef["entities"] = specEntities;
specRef["scenes"] = specScenes;
specRef["map"] = specMap;

const hoverCtrl = (id: string) => {
    state.currentHover = specRef[id];
}

const hoverLeave = () => {
    state.currentHover = ref<HTMLElement | null>(null);
}

const resetEvents = async () => {
    await APIRequests.Games.resetEventsGame();

    stateSocket.ennemyAppearEvents = defaultSocketState.ennemyAppearEvents;
    stateSocket.visibilityChangeEvents = defaultSocketState.visibilityChangeEvents;
    stateSocket.characterSheetEvent = defaultSocketState.characterSheetEvent;
    stateSocket.showStateEvent = defaultSocketState.showStateEvent;
    stateSocket.chatMessageEvent = defaultSocketState.chatMessageEvent;
}

</script>
<style scoped>
</style>
