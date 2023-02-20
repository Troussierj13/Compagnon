<template>
    <div class="flex w-full gap-1 font-sansserif font-bold text-[0.6rem] leading-[0.8rem]">
        <span
            class="relative flex grow h-[1.125rem] rounded hover:bg-slate-200/40 cursor-pointer">
            {{ props.armor.name }}
            <BottomGrayLine />
        </span>
        <span class="relative flex w-1/5 justify-center h-[1.125rem] my-auto">
            {{ props.armor.parade === "" ? props.armor.protection : props.armor.parade }}
            <BottomGrayLine />
        </span>
        <span class="relative flex w-1/5 justify-center h-[1.125rem] my-auto">
            {{ props.armor.name !== '' ? props.weight : "" }}
            <BottomGrayLine />
        </span>
    </div>
</template>

<script lang="ts" setup>
import BottomGrayLine from "../LineComponent/BottomGrayLine.vue";
import {ArmorType} from "@/utils/Types/ArmorType";

interface Props {
    armor: ArmorType;
    weight: number;
}

const props = defineProps<Props>();

</script>

<style scoped></style>
