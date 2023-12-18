<template>
    <div class="flex mx-3">
        <span v-if="props.favorisable" class="square relative mr-2 flex">
            <span
                v-if="skill.favored"
                class="absolute h-3 w-3 rotate-45 bg-check bg-cover bg-center bg-no-repeat"
            ></span>
        </span>
        <span
            class="line-bottom-sm relative mr-2 h-[1.375rem] grow font-serif text-[0.8rem] font-bold leading-[rem]"
        >{{ props.skill.name }}</span
        >
        <span class="square mx-1.5 rotate-45">
            <span
                v-if="props.skill.rank >= 1"
                class="absolute h-3 w-3 bg-check bg-cover bg-center bg-no-repeat"
            ></span>
        </span>
        <span class="square mx-1.5 rotate-45">
            <span
                v-if="props.skill.rank >= 2"
                class="absolute h-3 w-3 bg-check bg-cover bg-center bg-no-repeat"
            ></span>
        </span>
        <span class="square mx-1.5 rotate-45">
            <span
                v-if="props.skill.rank >= 3"
                class="absolute h-3 w-3 bg-check bg-cover bg-center bg-no-repeat"
            ></span>
        </span>
        <span class="square mx-1.5 rotate-45">
            <span
                v-if="props.skill.rank >= 4"
                class="absolute h-3 w-3 bg-check bg-cover bg-center bg-no-repeat"
            ></span>
        </span>
        <span class="square mx-1.5 rotate-45">
            <span
                v-if="props.skill.rank >= 5"
                class="absolute h-3 w-3 bg-check bg-cover bg-center bg-no-repeat"
            ></span>
        </span>
        <span class="square mx-1.5 rotate-45">
            <span
                v-if="props.skill.rank >= 6"
                class="absolute h-3 w-3 bg-check bg-cover bg-center bg-no-repeat"
            ></span>
        </span>
    </div>
</template>

<script lang="ts" setup>
import {SkillType} from "@/utils/Types/PlayerType";

interface Props {
    favorisable: boolean;
    skill: SkillType;
}

const props = defineProps<Props>();
</script>

<style scoped></style>
