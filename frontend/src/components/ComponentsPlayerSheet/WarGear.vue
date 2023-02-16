<template>
    <TopDoubleLine class="w-[99%]" />
    <div class="relative flex flex-col h-full w-2/3 pt-2 pr-2">
        <RightSimpleLine class="h-[80%] mt-1" />
        <div class="flex w-full gap-1 font-sansserif text-[0.6rem] font-bold leading-[0.8rem]">
            <span class="grow font-UncialAntiqua text-base font-normal text-red">Attirail de guerre</span>
            <span class="my-auto h-2.5 w-1/12 text-center">Dégats</span>
            <span class="my-auto h-2.5 w-1/12 text-center">Blessure</span>
            <span class="my-auto h-2.5 w-1/12 text-center">Charge</span>
            <span class="my-auto h-2.5 w-4/12">Notes</span>
        </div>
        <div
            v-for="n in 4"
            :key="n - 1"
            class="flex grow flex-col justify-center"
        >
            <WeaponRow :weapon="props.player.weapons[n - 1]" />
        </div>
    </div>
    <div class="flex h-full grow flex-col justify-between pt-2 pl-2 pr-2">
        <div class="mt-1">
            <div class="mb-1 flex w-full gap-1 text-[0.6rem] leading-[0.8rem]">
                <span class="grow font-serif font-bold">ARMURE</span>
                <span class="my-auto h-2.5 w-1/5 text-center font-sansserif font-bold">Protection</span>
                <span class="my-auto h-2.5 w-1/5 text-center font-sansserif font-bold">Charge</span>
            </div>
            <ArmorRow
                :armor="props.player.armor"
                :weight="props.player.getModifiedValue('armorWeight')"
            />
            <div class="flex w-full gap-1 text-[0.6rem] leading-[0.8rem]">
                <span class="grow font-sansserif font-bold">Casque</span>
            </div>
            <ArmorRow
                :armor="props.player.helm"
                :weight="props.player.getModifiedValue('helmWeight')"
            />
        </div>
        <div>
            <div class="mb-1 flex w-full gap-1 text-[0.6rem] leading-[0.8rem]">
                <span class="grow font-serif font-bold">BOUCLIER</span>
                <span class="my-auto h-2.5 w-1/5 text-center font-sansserif font-bold">Parade</span>
                <span class="my-auto h-2.5 w-1/5 text-center font-sansserif font-bold">Charge</span>
            </div>
            <ArmorRow
                :armor="props.player.shield"
                :weight="props.player.getModifiedValue('shieldWeight')"
            />
        </div>
    </div>
</template>
<script lang="ts" setup>
import {PlayerType} from "@/utils/Types/PlayerType";
import ArmorRow from "./ArmorRow.vue";
import WeaponRow from "./WeaponRow.vue";
import RightSimpleLine from "../LineComponent/RightSimpleLine.vue";
import TopDoubleLine from "../LineComponent/TopDoubleLine.vue";

interface Props {
    player: PlayerType
}

const props = defineProps<Props>();

</script>