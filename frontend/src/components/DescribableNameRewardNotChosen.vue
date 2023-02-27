<template>
    <div
        class="flex font-medium cursor-pointer"
        @click="tryChangeHover">
        <span class="relative z-10 font-UncialAntiqua whitespace-nowrap">
            {{ props.reward.defaultChoice.name }}
        </span>
        <InformationCircleIcon class="relative z-10 h-3 w-3 ml-2 mb-auto text-red" />
        <div
            v-if="state.hover"
            class="flex absolute z-40 text-xs font-sansserif font-semibold leading-4 bg-white w-72 rounded border border-gray/40 p-3 shadow-md top-6 after:absolute after:content-[''] after:h-4 after:w-4 after:rotate-45 after:-top-[0.54rem] after:border-l after:border-t after:rounded-tl after:border-gray/40 after:bg-white">
            {{ props.reward.defaultChoice.description }}
            <span
                class="relative text-red mr-2 ml-auto"
                @click.stop.prevent="state.hoverChoice = !state.hoverChoice">
                (Appliquer)
                <div
                    v-if="state.hoverChoice"
                    class="flex flex-col absolute z-50 text-xs font-sansserif font-semibold text-black leading-4 bg-white w-56 gap-2 rounded border border-gray/40 p-3 shadow-md top-6 after:absolute after:content-[''] after:h-4 after:w-4 after:rotate-45 after:-top-[0.54rem] after:border-l after:border-t after:rounded-tl after:border-gray/40 after:bg-white">
                    <div class="flex justify-between w-full">
                        <span class="grow">Equipements</span>
                        <span>Valeur modifié</span>
                    </div>
                    <div
                        v-for="(rew, index) in props.reward.getInfos()"
                        :key="index"
                        class="flex text-xs font-normal rounded hover:bg-slate-200/40"
                        @click="changeChosenVirtue(rew.applyTo)">
                        <div
                            v-for="(wgInfo, i) in getWarGearInfo(rew.applyTo, rew.modifiers)"
                            :key="i"
                            class="flex justify-between w-full">
                            <span class="grow">{{ wgInfo.name }}</span>

                            <div
                                v-if="wgInfo.value === 0 && wgInfo.modifiedValue === 0"
                                class="flex">
                                <span class="h-0.5 w-12 mr-2 my-auto rounded bg-slate-600"></span>
                            </div>
                            <div
                                v-else
                                class="flex">
                                <span class="px-1 text-slate-400">{{ wgInfo.value }}</span>
                                <ArrowLongRightIcon class="h-4 w-4" />
                                <span class="px-1 text-red">{{ wgInfo.modifiedValue }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>

import {InformationCircleIcon} from '@heroicons/vue/24/outline';
import {reactive} from "vue";
import {PlayerType} from "@/utils/Types/PlayerType";
import {HoverSingleton} from "@/utils/helpers";
import {ApplyIdentifier, Reward} from "@/utils/VallianceWisdom/Rewards";
import {ArrowLongRightIcon} from "@heroicons/vue/20/solid";
import {ModifierParam, Modifiers} from "@/utils/MapModifiers";

interface Props {
    reward: Reward;
    rewardId: number;
    player: PlayerType;
}

interface State {
    hover: boolean;
    hoverChoice: boolean;
}

interface WarGearInfo {
    name: string;
    value: number;
    modifiedValue: number;
}

const props = defineProps<Props>();
const state = reactive<State>({
    hover: false,
    hoverChoice: false
});

const tryChangeHover = () => {
    state.hover = HoverSingleton.GetInstance().tryChangeHover(state.hover, () => {
        state.hover = false;
        state.hoverChoice = false;
    });
};

const changeChosenVirtue = (applyTo: ApplyIdentifier) => {
    props.player.setRewardChoice(props.rewardId, applyTo);
    props.player.saveOnDb();
};

const warGearExist = (identifier: ApplyIdentifier): boolean => {
    switch (identifier) {
    case "notApply":
        return false;
    case "armor":
        return props.player.armor.identifier !== 'unknown';
    case "helm":
        return props.player.helm.identifier !== 'unknown';
    case "shield":
        return props.player.shield.identifier !== 'unknown';
    case "weapon":
        return props.player.weapons.length > 0;

    }
};

const getWarGearInfo = (identifier: ApplyIdentifier, mods: Array<ModifierParam>): Array<WarGearInfo> => {
    if (warGearExist(identifier)) {
        switch (identifier) {
        case "armor":
            return [
                {
                    name: props.player.armor.name,
                    value: mods[0] ? props.player.getValue(mods[0].identifier) : 0,
                    modifiedValue: mods[0] ? Modifiers.tryModify(props.player.getValue(mods[0].identifier), mods) : 0
                }
            ];
        case "helm":
            return [
                {
                    name: props.player.helm.name,
                    value: mods[0] ? props.player.getValue(mods[0].identifier) : 0,
                    modifiedValue: mods[0] ? Modifiers.tryModify(props.player.getValue(mods[0].identifier), mods) : 0
                }
            ];
        case "shield":
            return [
                {
                    name: props.player.shield.name,
                    value: mods[0] ? props.player.getValue(mods[0].identifier) : 0,
                    modifiedValue: mods[0] ? Modifiers.tryModify(props.player.getValue(mods[0].identifier), mods) : 0
                }
            ];
        case "weapon":
            return [];
        }
    }
    return [];
};

</script>

<style scoped>

</style>