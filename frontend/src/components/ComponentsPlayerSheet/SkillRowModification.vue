<template>
    <div class="flex mx-3">
        <span v-if="props.skill instanceof SkillType" class="square relative mr-2 flex">
            <span
                v-if="modifSkill instanceof SkillType && modifSkill.favored"
                class="absolute h-3 w-3 rotate-45 bg-check bg-cover bg-center bg-no-repeat cursor-pointer"
                @click="(modifSkill instanceof SkillType ? modifSkill.favored = false : null)"
            ></span>
            <span
                v-else
                class="absolute flex -inset-0.5 cursor-pointer"
                @click="(modifSkill instanceof SkillType ? modifSkill.favored = true : null)">
                <span
                    class="absolute h-3 w-3 rotate-45 bg-check bg-cover bg-center bg-no-repeat opacity-10 animate-ping"
                ></span>
                <span
                    class="absolute z-40 h-3 w-3 rotate-45 bg-check bg-cover bg-center bg-no-repeat opacity-10"
                ></span>
            </span>
        </span>
        <span
            class="line-bottom-sm relative mr-2 h-[1.375rem] grow font-serif text-[0.8rem] font-bold leading-[rem]"
        >{{ props.skill.name }}</span
        >
        <span
            v-for="n in 6"
            :key="n"
            class="square relative mx-1.5 rotate-45">
            <span
                v-if="props.skill.rank >= n"
                class="absolute h-3 w-3 bg-check bg-cover bg-center bg-no-repeat cursor-pointer"
                @click="changeRank(n-1)">
            </span>
            <span
                v-else
                class="absolute flex -inset-0.5 -rotate-45 cursor-pointer"
                @click="changeRank(n)">
                <span
                    class="absolute h-3 w-3 rotate-45 bg-check bg-cover bg-center bg-no-repeat opacity-10 animate-ping"
                ></span>
                <span
                    class="absolute z-40 h-3 w-3 rotate-45 bg-check bg-cover bg-center bg-no-repeat opacity-10"
                ></span>
            </span>
        </span>
    </div>
</template>

<script lang="ts" setup>
import {CombatSkillType, SkillType} from "@/utils/Types/PlayerType";
import {reactive} from "vue";

interface Props {
    skill: SkillType | CombatSkillType;
}

const props = defineProps<Props>();
const modifSkill = reactive<SkillType | CombatSkillType>(props.skill) as SkillType | CombatSkillType;

const changeRank = (newRank: any) => {
    if (typeof newRank === typeof props.skill.rank) {
        modifSkill.rank = newRank;
    }
};

</script>

<style scoped></style>
