<template>
    <div class="flex mx-3">
        <span v-if="props.favorisable" class="square relative mr-2 flex">
            <span
                v-if="('favored' in props.skill) && props.skill.favored"
                class="absolute h-3 w-3 rotate-45 bg-check bg-cover bg-center bg-no-repeat cursor-pointer"
                @click="('favored' in state.modifSkill) && (state.modifSkill.favored = false)"
            ></span>
            <span
                v-else
                class="absolute flex -inset-0.5 cursor-pointer"
                @click="('favored' in state.modifSkill) && (state.modifSkill.favored = true)">
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
        >
            {{ ('name' in props.skill) ? props.skill.name : '' }}
        </span>
        <span
            v-for="n in 6"
            :key="n"
            class="square relative mx-1.5 rotate-45">
            <span
                v-if="'rank' in props.skill && props.skill.rank >= n"
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
import {CombatSkillsType, SkillType} from "../../utils/Types/PlayerType";
import {IntRange} from "../../utils/helpers";
import {reactive} from "vue";

interface Props {
    favorisable: boolean;
    skill: SkillType | CombatSkillsType;
}

interface State {
    modifSkill: SkillType | CombatSkillsType;
}

const props = defineProps<Props>();
const state = reactive<State>({
    modifSkill: props.skill,
});

const validateRank = (rank: number): rank is IntRange<0, 6> => {
    return rank >= 0 && rank <= 6;
}

const changeRank = (nRank: number) => {
    if('rank' in state.modifSkill && validateRank(nRank)) {
        state.modifSkill.rank = nRank;
    }
}

</script>

<style scoped></style>
