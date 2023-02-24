<template>
    <div class="relative h-full w-full px-3">
        <RightDoubleLine />
        <div class="absolute z-50 top-1/3 left-[50%] -translate-x-[50%]">
            <span class="relative z-40 text-red bg-yellow pl-2 pr-8">COMPETENCES</span>
            <Cog6ToothIcon
                v-if="!state.onModification"
                class="absolute right-2 top-[50%] -translate-y-[50%] z-50 w-4 h-4 text-gray cursor-pointer"
                @click="changeModificationSkill" />
            <CheckCircleIcon
                v-else
                class="absolute right-2 top-[50%] -translate-y-[50%] z-50 w-4 h-4 text-green-600 cursor-pointer"
                @click="changeModificationSkill" />
        </div>
        <div class="flex flex-col h-full w-full">
            <div class="flex flex-col h-1/3 w-full justify-center mb-2">
                <span class="mx-auto text-red">C&#338;UR</span>

                <div class="flex flex-col h-full justify-center mr-10">
                    <span class="diamond diamond-lg relative top-2.5 ml-[56.7%] mr-auto">
                        <span>{{ props.player.getModifiedValue('heart') }}</span>
                        <span class="absolute -top-8 left-0 text-xs">Valeur</span>
                    </span>
                    <span class="diamond diamond-double diamond-xl mx-auto">
                        <span>{{ props.player.getModifiedValue('heartSR') }}</span>
                        <span class="absolute right-3 -bottom-7 text-xs">SR</span>
                    </span>
                    <span class="diamond diamond-lg relative -top-2.5 ml-[56.7%] mr-auto">
                        <span>{{ props.player.getModifiedValue('hopeMax') }}</span>
                        <span class="absolute -top-1 left-10 text-xs">Espoir</span>
                    </span>
                </div>
            </div>
            <div class="relative grow w-full">
                <TopSimpleLine />
                <div v-if="!state.onModification" class="flex flex-col h-full justify-between pt-[18px] pb-2">
                    <div v-for="skill in props.player.heartSkills" :key="skill.identifier">
                        <SkillRow
                            :favorisable="true"
                            :skill="skill"
                        />
                    </div>
                </div>
                <div v-else class="flex flex-col h-full justify-between pt-[18px] pb-2">
                    <div v-for="skill in props.player.heartSkills" :key="skill.identifier">
                        <SkillRowModification
                            :favorisable="true"
                            :skill="skill"
                        />
                    </div>
                </div>
            </div>
            <div class="relative h-40">
                <TopSimpleLine />
                <div class="flex flex-col h-full pt-2">
                    <div class="flex h-5 w-full justify-between mb-2">
                        <span class="text-red text-sm">RECOMPENSES</span>
                        <span class="relative diamond diamond-md top-3">
                            <span>{{ props.player.valiance.rank }}</span>
                            <span class="absolute top-5 -left-16 font-serif text-[0.65rem]">
                                VAILLANCE
                            </span>
                        </span>
                    </div>
                    <div
                        v-for="reward in props.player.valiance.rewards"
                        :key="reward.identifier"
                        class="whitespace-normal text-xs relative mb-0.5 ml-3"
                    >
                        <span class="break-words relative">
                            <DescribableName :values="reward.info" />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {PlayerType} from "@/utils/Types/PlayerType";
import RightDoubleLine from "../LineComponent/RightDoubleLine.vue";
import TopSimpleLine from "../LineComponent/TopSimpleLine.vue";
import SkillRow from "../ComponentsPlayerSheet/SkillRow.vue";
import DescribableName from "../DescribableName.vue";
import {Cog6ToothIcon} from "@heroicons/vue/24/solid";
import {CheckCircleIcon} from "@heroicons/vue/24/outline";
import {reactive} from "vue";
import {LevelUpSingleton} from "@/utils/Types/LevelUpSingleton";
import SkillRowModification from "./SkillRowModification.vue";

interface Props {
    player: PlayerType
}

interface State {
    onModification: boolean
}

const props = defineProps<Props>();
const state = reactive<State>({
    onModification: false
});

LevelUpSingleton.GetInstance(props.player._id).registerCallback(b => state.onModification = b);

const changeModificationSkill = () => {
    LevelUpSingleton.GetInstance(props.player._id).setOnModification(!state.onModification);

    if (!state.onModification) {
        props.player.saveOnDb();
    }
};
</script>
