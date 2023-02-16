<template>
    <div class="relative h-full">
        <TopSimpleLine class="left-2 -top-1" />
        <div class="flex flex-col h-full pt-1">
            <span class="text-md mx-auto mb-2 text-center text-red">Equipement de voyage</span>
            <div
                v-for="(equip, index) in props.player.travelEquipment"
                :key="index"
                class="scroll-bar-red flex flex-col grow max-h-20 overflow-auto text-xs pl-4"
            >
                <span>
                    {{ equip.name }} (<span class="font-semibold">{{
                        props.player.getSkill(equip.skillRef).name
                    }}</span>)
                </span>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>

import {PlayerType} from "@/utils/Types/PlayerType";
import TopSimpleLine from "../LineComponent/TopSimpleLine.vue";

interface Props {
    player: PlayerType;
}

const props = defineProps<Props>();

</script>