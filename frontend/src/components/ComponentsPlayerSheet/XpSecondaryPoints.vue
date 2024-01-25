<template>
    <div class="flex">
        <div class="relative flex w-1/3 flex-col justify-center">
            <span class="mx-auto mb-2 whitespace-pre-line text-center text-2xs text-red">POINTS D'AVENTURE</span>
            <EditablePoints
                :identifier-attr="'adventurePoints'"
                :player="props.player"
                :size-diamond="'medium'"/>
        </div>
        <div class="flex w-1/3 flex-col justify-center">
            <span class="mx-auto mb-2 whitespace-pre-line text-center text-2xs text-red">POINTS DE PROGRESSION</span>
            <EditablePoints
                :identifier-attr="'progressPoints'"
                :player="props.player"
                :size-diamond="'medium'"/>
        </div>
        <div class="flex w-1/3 flex-col justify-center">
            <span class="mx-auto mb-2 whitespace-pre-line text-center text-2xs text-red">POINTS DE COMMUNAUTE</span>
            <EditablePoints
                :identifier-attr="'communityPoints'"
                :player="props.player"
                :size-diamond="'medium'"/>
        </div>
    </div>
    <div class="flex grow py-8">
        <div class="flex w-1/2 flex-col justify-between">
            <span class="text-xs mx-2 mb-auto whitespace-pre-line text-center text-red">ENDURANCE ACTUELLE</span>
            <div class="mr-6 mt-6 flex flex-col">
                <span class="relative top-3.5 -right-2 ml-[55.5%] mr-auto">
                    <span class="relative flex w-fit mx-auto diamond diamond-md">
                        <span class="cursor-pointer select-none">
                            {{ props.player.getModifiedValue('weight') }}
                        </span>
                    </span>
                    <span class="absolute -top-6 -right-1 text-xs">Charge</span>
                </span>
                <EditablePoints
                    :identifier-attr="'currentEndurance'"
                    :player="props.player"
                    :size-diamond="'large'"
                    :str-to-zero="'-'"/>
                <span
                    class="relative -top-3.5 -right-2 ml-[55.5%] mr-auto">
                    <EditablePoints
                        :identifier-attr="'fatigue'"
                        :player="props.player"
                        :size-diamond="'medium'"
                        :str-to-zero="'-'"/>
                    <span class="absolute top-10 -left-2 text-xs">Fatigue</span>
                </span>
            </div>
        </div>
        <div class="flex w-1/2 flex-col justify-between">
            <span class="text-xs mx-8 mb-auto whitespace-pre-line text-center text-red">ESPOIR ACTUEL</span>
            <div class="mr-6 mt-6 flex flex-col">
                <span
                    class="relative top-3.5 -right-2 ml-[55.5%] mr-auto">
                    <EditablePoints
                        :identifier-attr="'shadows'"
                        :player="props.player"
                        :size-diamond="'medium'"
                        :str-to-zero="'-'"/>
                    <span class="absolute -top-6 -right-2 text-xs">Ombres</span>
                </span>
                <EditablePoints
                    :identifier-attr="'currentHope'"
                    :player="props.player"
                    :size-diamond="'large'"/>
                <span
                    class="relative -top-3.5 -right-2 ml-[55.5%] mr-auto">
                    <EditablePoints
                        :identifier-attr="'sequels'"
                        :player="props.player"
                        :size-diamond="'medium'"
                        :str-to-zero="'-'"/>
                    <span class="absolute top-10 -left-3 text-xs">Séquelles</span>
                </span>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>

import {PlayerType} from "../../utils/Types/PlayerType";
import EditablePoints from "./EditablePoints.vue";

interface Props {
    player: PlayerType;
}

const props = defineProps<Props>();

</script>