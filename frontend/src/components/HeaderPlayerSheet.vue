<template>
    <div
        class="relative w-full flex text-[0.6rem] leading-[1.2rem] font-sansserif font-bold"
    >
        <div
            class="absolute -top-11 left-[50%] mx-2 text-xl text-center w-80 font-UncialAntiqua font-medium"
        >
            {{ props.data.name }}
        </div>
        <div class="h-full w-1/3 flex flex-col pl-2 pr-5 py-2 space-y-2">
            <span class="grayscale line-bottom-sm h-5 flex gap-3">
                <span class="text-[0.5rem] leading-[0.7rem] mb-auto"
                >Culture héroïque</span
                >
                <span class="font-UncialAntiqua font-medium">{{
                    props.data.heroicCulture
                }}</span>
            </span>
            <span class="grayscale line-bottom-sm h-5 flex gap-3">
                <span class="text-[0.5rem] leading-[0.7rem] mb-auto"
                >Avantage culturel</span
                >
                <span class="font-UncialAntiqua font-medium">{{
                    props.data.culturalAdvantage
                }}</span>
            </span>
            <span class="grayscale line-bottom-sm h-5 flex gap-3">
                <span class="text-[0.5rem] leading-[0.7rem] mb-auto">Vocation</span>
                <span class="font-UncialAntiqua font-medium">{{
                    props.data.vocation
                }}</span>
            </span>
        </div>
        <div class="h-full w-1/3 flex flex-col pl-2 pr-5 py-2 space-y-2">
            <div class="flex">
                <div class="flex flex-col w-11/12 space-y-2">
                    <div class="h-5 flex">
                        <span class="grayscale line-bottom-sm flex gap-3 w-1/5 mr-2">
                            <span class="text-[0.5rem] leading-[0.7rem] mb-auto">Age</span>
                            <span class="font-UncialAntiqua font-medium">{{
                                props.data.age
                            }}</span>
                        </span>
                        <span class="grayscale line-bottom-sm flex gap-3 w-4/5 mr-2">
                            <span class="text-[0.5rem] leading-[0.7rem] mb-auto"
                            >Niveau de vie</span
                            >
                            <span class="font-UncialAntiqua font-medium">{{
                                props.data.qualityLife
                            }}</span>
                        </span>
                    </div>
                    <div class="h-5">
                        <span class="grayscale line-bottom-sm h-5 flex gap-3 mr-2">
                            <span class="text-[0.5rem] leading-[0.7rem] mb-auto">Garant</span>
                            <span class="font-UncialAntiqua font-medium">{{
                                props.data.garant
                            }}</span>
                        </span>
                    </div>
                </div>
                <div class="flex flex-col grow aspect-square m-auto">
                    <span>Trésor</span>
                    <span class="square-xl">{{ props.data.treasure }}</span>
                </div>
            </div>
            <span class="grayscale line-bottom-sm h-5 flex gap-3 mr-2">
                <span class="text-[0.5rem] leading-[0.7rem] mb-auto"
                >Voie de l'ombre</span
                >
                <span class="font-UncialAntiqua font-medium">{{
                    props.data.shadowPath
                }}</span>
            </span>
        </div>
        <div class="h-full w-1/3 flex flex-col pl-2 pr-5 py-2 space-y-2">
            <span class="grayscale line-bottom-sm h-5 flex gap-3">
                <span class="text-[0.5rem] leading-[0.7rem] mb-auto"
                >Particularités</span
                >
                <span class="font-UncialAntiqua font-medium">{{
                    props.data.particularities.slice(0, 3).join(", ")
                }}</span>
            </span>
            <span class="grayscale line-bottom-sm h-5 flex gap-3">
                <span class="pl-4 font-UncialAntiqua font-medium">{{
                    props.data.particularities.slice(3).join(", ")
                }}</span>
            </span>
            <span class="grayscale line-bottom-sm h-5 flex gap-3">
                <span class="text-[0.5rem] leading-[0.7rem] mb-auto">Défauts</span>
                <span class="font-UncialAntiqua font-medium">{{
                    props.data.faults.join(", ")
                }}</span>
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    data: {
        type: Object,
        default() {
            return {
                heroicCulture: "",
                culturalAdvantage: "",
                vocation: "",
                age: 0,
                qualityLife: "",
                garant: "",
                shadowPath: "",
                treasure: 0,
                particularities: [],
                faults: [],
            };
        },
    },
});
</script>

<style scoped></style>
