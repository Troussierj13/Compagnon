<template>
    <div class="relative w-full flex text-[0.6rem] leading-[1.2rem] font-sansserif font-bold">
        <div
            class="absolute -top-11 left-[50%] mx-2 text-xl text-center w-80 font-UncialAntiqua font-medium">
            {{ props.values.name }}
        </div>
        <div class="h-full w-1/3 flex flex-col pl-2 pr-5 py-2 space-y-2">
            <span class="relative h-5 flex gap-3">
                <span class="text-[0.5rem] leading-[0.7rem] mb-auto">Culture héroïque</span>
                <span class="font-UncialAntiqua font-medium">{{
                        props.values.heroicCulture
                    }}</span>
                <BottomGrayLine/>
            </span>
            <span class="relative h-5 flex">
                <span class="text-[0.5rem] leading-[0.7rem] mb-auto mr-2 whitespace-nowrap">Avantage culturel</span>
                <span
                    v-for="advantage in state.culturalAdvantage"
                    :key="advantage.name"
                    class="font-medium">
                    <DescribableName :values="advantage"/>
                </span>
                <BottomGrayLine/>
            </span>
            <span class="relative h-5 flex gap-3">
                <span class="text-[0.5rem] leading-[0.7rem] mb-auto">Vocation</span>
                <DescribableName :values="props.values.vocation.name"/>
                <BottomGrayLine/>
            </span>
        </div>
        <div class="h-full w-1/3 flex flex-col pl-2 pr-5 py-2 space-y-2">
            <div class="flex">
                <div class="flex flex-col w-11/12 space-y-2">
                    <div class="h-5 flex">
                        <span class="relative flex gap-3 w-1/5 mr-2">
                            <span class="text-[0.5rem] leading-[0.7rem] mb-auto">Age</span>
                            <span class="font-UncialAntiqua font-medium">{{
                                    props.values.age
                                }}</span>
                            <BottomGrayLine/>
                        </span>
                        <span class="relative flex gap-3 w-4/5 mr-2">
                            <span class="text-[0.5rem] leading-[0.7rem] mb-auto"
                            >Niveau de vie</span
                            >
                            <span class="font-UncialAntiqua font-medium">{{
                                    props.values.qualityLife.name
                                }}</span>
                            <BottomGrayLine/>
                        </span>
                    </div>
                    <div class="h-5">
                        <span class="relative h-5 flex gap-3 mr-2">
                            <span class="text-[0.5rem] leading-[0.7rem] mb-auto">Garant</span>
                            <span class="font-UncialAntiqua font-medium">{{
                                    props.values.garant
                                }}</span>
                            <BottomGrayLine/>
                        </span>
                    </div>
                </div>
                <div class="flex flex-col grow aspect-square m-auto">
                    <span>Trésor</span>
                    <span class="square-xl">{{
                            props.values.treasure
                        }}</span>
                </div>
            </div>
            <span class="relative h-5 flex gap-3 mr-2">
                <span class="text-[0.5rem] leading-[0.7rem] mb-auto">Voie de l'ombre</span>
                <DescribableName :values="props.values.vocation.shadowPath"/>
                <BottomGrayLine/>
            </span>
        </div>
        <div class="h-full w-1/3 flex flex-col pl-2 pr-5 py-2 space-y-2">
            <span class="relative h-5 flex gap-3">
                <span class="text-[0.5rem] leading-[0.7rem] mb-auto">Particularités</span>
                <span class="font-UncialAntiqua font-medium">{{
                        props.values.particularities.join(", ")
                    }}</span>
                <BottomGrayLine/>
            </span>
            <span class="relative h-5 flex gap-3">
                <span class="pl-4">
                    <DescribableName :values="props.values.vocation.particularity"/>
                </span>
                <BottomGrayLine/>
            </span>
            <span class="relative h-5 flex gap-3">
                <span class="text-[0.5rem] leading-[0.7rem] mb-auto">Défauts</span>
                <span class="font-UncialAntiqua font-medium">{{
                        props.values.faults.join(", ")
                    }}</span>
                <BottomGrayLine/>
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>

import {HeaderValues} from "../../utils/Types/PlayerType";
import BottomGrayLine from "../LineComponent/BottomGrayLine.vue";
import DescribableName from "../DescribableName.vue";
import {DescribableName as DescribableNameType} from "../../utils/helpers";
import {reactive} from "vue";

interface Props {
    values: HeaderValues;
}

interface State {
    culturalAdvantage: Array<DescribableNameType>
}

const props = defineProps<Props>();
const state = reactive<State>({
    culturalAdvantage: props.values.culturalAdvantage
});


</script>

<style scoped></style>
