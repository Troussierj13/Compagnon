<template>
    <div class="relative h-full w-full">
        <RightDoubleLine />
        <div class="flex flex-col h-full w-full pr-3">
            <div class="flex flex-col h-1/3 w-full justify-center mb-2">
                <span class="mx-auto text-red">CORPS</span>
                <div class="flex flex-col h-full justify-center mr-10">
                    <span class="diamond diamond-lg relative top-2.5 ml-[56.7%] mr-auto">
                        <span>{{ props.player.getModifiedValue('strength') }}</span>
                        <span class="absolute -top-8 left-0 text-xs">Valeur</span>
                    </span>
                    <span class="diamond diamond-double diamond-xl mx-auto">
                        <span>{{ props.player.getModifiedValue('strengthSR') }}</span>
                        <span class="absolute right-3 -bottom-7 text-xs">SR</span>
                    </span>
                    <span class="diamond diamond-lg relative -top-2.5 ml-[56.7%] mr-auto">
                        <span>{{ props.player.getModifiedValue('enduranceMax') }}</span>
                        <span class="absolute -top-3 left-9 text-xs">Endurance</span>
                    </span>
                </div>
            </div>
            <div class="relative grow w-full">
                <TopSimpleLine />
                <div v-if="!state.onModification" class="flex flex-col h-full justify-between pt-[18px] pb-2">
                    <div v-for="skill in props.player.strengthSkills" :key="skill.identifier">
                        <SkillRow
                            :favorisable="true"
                            :skill="skill"
                        />
                    </div>
                </div>
                <div v-else class="flex flex-col h-full justify-between pt-[18px] pb-2">
                    <div v-for="skill in props.player.strengthSkills" :key="skill.identifier">
                        <SkillRowModification
                            :favorisable="true"
                            :skill="skill"
                        />
                    </div>
                </div>
            </div>
            <div class="relative h-40">
                <TopSimpleLine />
                <div class="flex flex-col h-full justify-between pt-2 pb-[10px]">
                    <span class="text-red text-sm">COMPETENCES DE COMBATS</span>
                    <div v-if="!state.onModification" class="my-auto flex flex-col justify-center gap-1">
                        <div v-for="skill in props.player.combatSkills" :key="skill.identifier">
                            <SkillRow
                                :favorisable="false"
                                :skill="skill"
                            />
                        </div>
                    </div>
                    <div v-else class="my-auto flex flex-col justify-center gap-1">
                        <div v-for="skill in props.player.combatSkills" :key="skill.identifier">
                            <SkillRowModification
                                :favorisable="false"
                                :skill="skill"
                            />
                        </div>
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
import {reactive} from "vue";
import SkillRowModification from "./SkillRowModification.vue";
import {LevelUpSingleton} from "@/utils/Types/LevelUpSingleton";

interface Props {
    player: PlayerType;
}

interface State {
    onModification: boolean;
}

const props = defineProps<Props>();
const state = reactive<State>({
    onModification: false,
});

LevelUpSingleton.GetInstance(props.player._id).registerCallback(b => state.onModification = b);
</script>
