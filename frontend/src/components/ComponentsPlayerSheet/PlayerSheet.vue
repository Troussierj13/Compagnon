<template>
    <div
        class="relative mx-auto flex min-w-[90rem] border-t-80 border-b-56 border-red/0 bg-sheet bg-cover bg-clip-border bg-center bg-origin-border">
        <div
            class="absolute -top-20 h-20 w-full bg-topSheet bg-contain bg-center brightness-75 contrast-125 saturate-150"></div>
        <div
            class="absolute -bottom-14 h-16 w-full bg-bottomSheet bg-cover bg-clip-border bg-center bg-origin-border"></div>
        <div class="flex h-full w-[74.2%] flex-col border-l-18 border-red/0">
            <div class="h-24 w-full">
                <HeaderPlayerSheet :values="state.player.getHeaderValues()" />
            </div>
            <div class="relative flex flex-col w-full grow">
                <RightDoubleLine />
                <div class="flex flex-col h-full w-full">
                    <div class="relative flex grow">
                        <div class="flex flex-col h-full w-1/3">
                            <StrengthColumn :player="state.player" />
                        </div>
                        <div class="flex flex-col h-full w-1/3">
                            <HeartColumn :player="state.player" />
                        </div>
                        <div class="flex flex-col h-full w-1/3">
                            <MindColumn :player="state.player" />
                        </div>
                    </div>
                    <div class="relative flex h-1/5 w-full pt-1">
                        <WarGear :player="state.player" />
                    </div>
                </div>
            </div>
        </div>
        <div class="flex h-full w-[24.7%] flex-col border-r-18 border-red/0 px-1">
            <div class="flex h-1/3 flex-col p-3">
                <div class="simple-border h-full w-full" />
            </div>
            <div class="flex grow flex-col">
                <XpSecondaryPoints :player="state.player" />
            </div>
            <div class="flex h-1/6">
                <States :player="state.player" />
            </div>
            <div class="relative flex h-1/5 flex-col">
                <TravelEquipment :player="state.player" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {PlayerType} from '@/utils/Types/PlayerType';
import {reactive} from 'vue';
import HeaderPlayerSheet from './HeaderPlayerSheet.vue';
import RightDoubleLine from "../LineComponent/RightDoubleLine.vue";
import StrengthColumn from "./StrengthColumn.vue";
import HeartColumn from "./HeartColumn.vue";
import MindColumn from "./MindColumn.vue";
import WarGear from "./WarGear.vue";
import XpSecondaryPoints from "./XpSecondaryPoints.vue";
import States from "./States.vue";
import TravelEquipment from "./TravelEquipment.vue";


const props = defineProps<{
    playerJson?: Object;
}>();

interface State {
    player: PlayerType;
}

const state = reactive<State>({
    player: new PlayerType(props.playerJson)
});
</script>

