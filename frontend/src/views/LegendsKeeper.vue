<template>
    <div class="flex flex-col relative h-full w-full justify-center items-center">
        <div id="spectator-screen" class="relative w-full h-[90%]">
            <div class="absolute scale-50 inset-0 -top-[25%] -left-[25%] flex border h-full w-full border-red"
                 ref="specCharacters"
                 @mouseenter.ctrl.exact="hoverCtrl('characters')">
                <Spectator :showState="{identifier: 'PlayerSheet', value: ''}"></Spectator>
            </div>
            <div
                class="absolute scale-50 inset-0 -top-[25%] left-[25%] flex border h-full w-full border-red"
                ref="specEntities"
                @mouseenter.ctrl.exact="hoverCtrl('entities')">
                <Spectator :showState="{identifier: 'Entities', value: ''}"></Spectator>
            </div>
            <div
                class="absolute scale-50 inset-0 top-[25%] -left-[25%] flex border h-full w-full border-red"
                ref="specScenes"
                @mouseenter.ctrl.exact="hoverCtrl('scenes')">
                <Spectator :showState="{identifier: 'None', value: ''}"></Spectator>
            </div>
            <div
                class="absolute scale-50 inset-0 top-[25%] left-[25%] flex border h-full w-full border-red"
                ref="specMap"
                @mouseenter.ctrl.exact="hoverCtrl('map')">
                <Spectator :showState="{identifier: 'None', value: ''}"></Spectator>
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
            <button class="rounded bg-amber-50 px-2 m-2" @click="APIRequests.Games.resetEventsGame()">ResetEvents</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {APIRequests} from "../utils/apiurls";
import Spectator from "./Spectator.vue";
import {reactive, Ref, ref} from "vue";
import {IDictionary} from "../utils/helpers";

interface State {
    currentHover: Ref;
}

const state = reactive<State>({
    currentHover: ref<HTMLElement | null>(null)
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

</script>
<style scoped>
</style>
