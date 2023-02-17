<template>
    <div class="relative h-full w-full px-3">
        <div class="flex flex-col h-full w-full">
            <div class="flex flex-col h-1/3 w-full justify-center mb-2">
                <span class="mx-auto text-red">ESPRIT</span>
                <div class="flex flex-col h-full justify-center mr-10">
                    <span class="diamond diamond-lg relative top-2.5 ml-[56.7%] mr-auto">
                        <span>{{ props.player.getModifiedValue('mind') }}</span>
                        <span class="absolute -top-8 left-0 text-xs">Valeur</span>
                    </span>
                    <span class="diamond diamond-double diamond-xl mx-auto">
                        <span>{{ props.player.getModifiedValue('mindSR') }}</span>
                        <span class="absolute right-3 -bottom-7 text-xs">SR</span>
                    </span>
                    <span class="diamond diamond-lg relative -top-2.5 ml-[56.7%] mr-auto">
                        <span>{{ props.player.getModifiedValue('parade') }}</span>
                        <span class="absolute -top-2 left-10 text-xs">Parade</span>
                    </span>
                </div>
            </div>
            <div class="relative grow w-full">
                <TopSimpleLine />
                <div class="flex flex-col h-full justify-between pt-[18px] pb-2">
                    <div v-for="skill in props.player.mindSkills" :key="skill.identifier">
                        <SkillRow
                            :favorisable="true"
                            :skill="skill"
                        />
                    </div>
                </div>
            </div>
            <div class="relative h-40">
                <TopSimpleLine />
                <div class="flex flex-col h-full pt-2">
                    <div class="flex h-4 w-full justify-between mb-2">
                        <span class="text-red text-sm">VERTUS</span>
                        <span class="relative diamond diamond-md top-3">
                            <span>{{ props.player.wisdom.rank }}</span>
                            <span class="absolute top-5 -left-16 font-serif text-[0.65rem]">
                                SAGESSE
                            </span>
                        </span>
                    </div>
                    <div
                        v-for="virtue in props.player.wisdom.virtues"
                        :key="virtue.identifier"
                        class="whitespace-normal text-xs relative mb-0.5 ml-3"
                    >
                        <span v-if="virtue.info.isChosen()" class="break-words relative">
                            <DescribableName :values="virtue.info.getChosen()[0]" />
                        </span>
                        <span v-else class="break-words relative">
                            <DescribableNameNotChosen :player="props.player" :virtue="virtue" />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {PlayerType} from "@/utils/Types/PlayerType";
import TopSimpleLine from "../LineComponent/TopSimpleLine.vue";
import SkillRow from "../ComponentsPlayerSheet/SkillRow.vue";
import DescribableName from "../DescribableName.vue";
import DescribableNameNotChosen from "../DescribableNameNotChosen.vue";

interface Props {
    player: PlayerType
}

const props = defineProps<Props>();

</script>
