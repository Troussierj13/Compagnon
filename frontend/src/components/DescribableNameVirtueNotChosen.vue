<template>
    <div
        class="flex font-medium cursor-pointer"
        @click="tryChangeHover">
        <span class="relative z-10 font-UncialAntiqua whitespace-nowrap">
            {{ props.virtue.defaultInfo.name }}
        </span>
        <InformationCircleIcon class="relative z-10 h-3 w-3 ml-2 mb-auto text-red" />
        <div
            v-if="state.hover"
            class="flex absolute z-40 text-xs font-sansserif font-semibold leading-4 bg-white w-72 rounded border border-gray/40 p-3 shadow-md top-6 after:absolute after:content-[''] after:h-4 after:w-4 after:rotate-45 after:-top-[0.54rem] after:border-l after:border-t after:rounded-tl after:border-gray/40 after:bg-white">
            {{ props.virtue.defaultInfo.description }}
            <span
                class="relative text-red mr-2 ml-auto"
                @click.stop.prevent="state.hoverChoice = !state.hoverChoice">
                (Choisir)
                <div
                    v-if="state.hoverChoice"
                    class="flex flex-col absolute z-50 text-xs font-sansserif font-semibold text-black leading-4 bg-white w-52 gap-2 rounded border border-gray/40 p-3 shadow-md top-6 after:absolute after:content-[''] after:h-4 after:w-4 after:rotate-45 after:-top-[0.54rem] after:border-l after:border-t after:rounded-tl after:border-gray/40 after:bg-white">
                    <span
                        v-for="(vir, index) in props.virtue.getInfos()"
                        :key="index"
                        @click="changeChosenVirtue(index)">
                        {{ vir.description }}
                    </span>
                </div>
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>

import {InformationCircleIcon} from '@heroicons/vue/24/outline';
import {reactive} from "vue";
import {Virtue} from "../utils/VallianceWisdom/Virtues";
import {PlayerType} from "../utils/Types/PlayerType";
import {HoverSingleton} from "../utils/helpers";

interface Props {
    virtue: Virtue;
    virtueId: number;
    player: PlayerType;
}

interface State {
    hover: boolean;
    hoverChoice: boolean
}

const props = defineProps<Props>();
const state = reactive<State>({
    hover: false,
    hoverChoice: false,
});

const tryChangeHover = () => {
    state.hover = HoverSingleton.GetInstance().tryChangeHover(state.hover, () => {
        state.hover = false;
        state.hoverChoice = false;
    });
};

const changeChosenVirtue = (index: number) => {
    props.player.setVirtueChoice(props.virtueId, index);
    props.player.saveOnDb();
};

</script>

<style scoped>

</style>