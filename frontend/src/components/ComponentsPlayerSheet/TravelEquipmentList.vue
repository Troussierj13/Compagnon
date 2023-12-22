<template>
    <div class="relative h-full">
        <TopSimpleLine class="left-2 -top-1" />
        <div class="flex flex-col h-full pt-1">
            <AddTravelEquipment :player="props.player" />
            <span class="text-sm mx-auto mb-2 text-center text-red">EQUIPEMENT DE VOYAGE</span>
            <div
                v-for="(equip, index) in props.player.travelEquipment"
                :key="index"
                class="relative flex flex-col text-xs pl-4"
            >
                <TravelEquipment :equip="equip" :player="props.player" />
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>

import {PlayerType} from "../../utils/Types/PlayerType";
import TopSimpleLine from "../LineComponent/TopSimpleLine.vue";
import AddTravelEquipment from "./AddTravelEquipment.vue";
import TravelEquipment from "./TravelEquipment.vue";

interface Props {
    player: PlayerType;
}

const props = defineProps<Props>();
</script>