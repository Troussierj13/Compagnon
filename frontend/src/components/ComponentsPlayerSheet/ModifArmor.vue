<template>
    <div
        class="flex flex-col absolute left-0 translate-x-[45%] -top-8 z-50 text-2xs text-black font-sansserif font-semibold leading-4 bg-white w-96 rounded border border-gray/40 p-3 shadow-md after:absolute after:content-[''] after:h-4 after:w-4 after:-rotate-45 after:-left-[0.54rem] after:top-11 after:border-l after:border-t after:rounded-tl after:border-gray/40 after:bg-white">
        <div
            class="flex w-full h-4 gap-1 font-sansserif font-bold text-2xs mb-2">
            <span class="grow">
            </span>
            <span v-if="props.changeIdentifier === 'shield'" class="my-auto h-2.5 w-1/5 text-center">Parade</span>
            <span v-else class="my-auto h-2.5 w-1/5 text-center">Protection</span>
            <span class="my-auto h-2.5 w-1/5 text-center">Charge</span>
        </div>
        <span
            v-for="armor in props.armors"
            :key="armor.name"
            class="cursor-pointer hover:bg-slate-200 px-1 rounded-sm pt-0.5">
            <ArmorRow
                :armor="armor"
                @click.stop="changeArmor(armor)" />
        </span>
        <span
            class="mt-3 ml-1 px-2 border border-red rounded w-fit font-UncialAntiqua text-red text-2xs font-normal cursor-pointer"
            @click.stop="changeArmor(new ArmorType())">Jeter</span>
    </div>
</template>
<script lang="ts" setup>
import {PlayerType} from "@/utils/Types/PlayerType";
import ArmorRow from "./ArmorRow.vue";
import {ArmorType} from "@/utils/Types/ArmorType";
import {HoverSingleton} from "@/utils/helpers";
import {ArmorIdentifier} from "@/utils/Types/IdentifiedType";

interface Props {
    armors: Array<ArmorType>;
    player: PlayerType;
    changeIdentifier: ArmorIdentifier
}

const props = defineProps<Props>();

const changeArmor = (armor: ArmorType) => {
    HoverSingleton.GetInstance().tryChangeHover(true, () => {
    });

    props.player.changeArmor(armor, props.changeIdentifier);
    props.player.saveOnDb();
};
</script>