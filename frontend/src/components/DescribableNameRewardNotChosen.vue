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
            class="flex absolute z-40 text-xs font-sansserif font-semibold leading-4 bg-white rounded border border-gray/40 p-3 shadow-md top-6 after:absolute after:content-[''] after:h-4 after:w-4 after:rotate-45 after:-top-[0.54rem] after:border-l after:border-t after:rounded-tl after:border-gray/40 after:bg-white">
            <span>{{ props.reward.defaultChoice.description }} </span>
            <span
                class="relative text-red ml-2"
                @click.stop.prevent="state.hoverChoice = !state.hoverChoice">
                (Appliquer)
                <div
                    v-if="state.hoverChoice"
                    class="flex flex-col absolute w-72 z-50 text-xs font-sansserif font-semibold text-black leading-4 bg-white gap-2 rounded border border-gray/40 p-3 shadow-md top-6 after:absolute after:content-[''] after:h-4 after:w-4 after:rotate-45 after:-top-[0.54rem] after:border-l after:border-t after:rounded-tl after:border-gray/40 after:bg-white">
                    <div class="grid grid-cols-2 mb-2">
                        <span>Equipements</span>
                        <span class="mx-auto">Valeur modifié</span>
                    </div>
                    <div
                        ref="equipements"
                        class="flex flex-col">
                        <div
                            v-for="(rew, index) in props.reward.getInfos()"
                            :key="index"
                            class="flex flex-col text-xs font-normal">
                            <div
                                v-for="(wgInfo, i) in getWarGearInfo(rew.applyTo, rew.modifiers)"
                                :key="i"
                                class="grid grid-cols-2 rounded hover:bg-slate-200/40"
                                @click="changeChosenReward(rew.applyTo, wgInfo)">
                                <div class="flex">{{ wgInfo.name }}</div>
                                <div
                                    v-if="wgInfo.value.length === 0 && wgInfo.modifiedValue.length === 0"
                                    class="flex">
                                    <span class="h-0.5 w-full mr-2 my-auto rounded bg-slate-600"></span>
                                </div>
                                <div
                                    v-else
                                    class="flex mx-auto">
                                    <span class="px-1 text-slate-400">{{ wgInfo.value.join('/') }}</span>
                                    <ArrowLongRightIcon class="h-4 w-4" />
                                    <span class="px-1 text-red">{{ wgInfo.modifiedValue.join('/') }}</span>
                                </div>
                            </div>
                        </div>
                        <span>{{ getInfoDiv() }}</span>
                    </div>
                </div>
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>

import {InformationCircleIcon} from '@heroicons/vue/24/outline';
import {reactive, ref} from "vue";
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
    identifier: 'weapon' | 'armor'
    id?: number
    name: string;
    value: Array<number>;
    modifiedValue: Array<number>;
}

const props = defineProps<Props>();
const state = reactive<State>({
    hover: false,
    hoverChoice: false
});

const equipements = ref(null);
const getInfoDiv = () => {
    if (equipements.value) {
        console.log(equipements);
    }
};

const tryChangeHover = () => {
    state.hover = HoverSingleton.GetInstance().tryChangeHover(state.hover, () => {
        state.hover = false;
        state.hoverChoice = false;
    });
};

const changeChosenReward = (applyTo: ApplyIdentifier, wgInfo: WarGearInfo) => {
    if (applyTo !== 'weapon') {
        props.player.setRewardChoiceArmor(props.rewardId, applyTo);
        props.player.saveOnDb();
        console.log('default');
    } else if (wgInfo.id !== undefined) {
        props.player.setRewardChoiceWeapon(props.rewardId, wgInfo.id);
        props.player.saveOnDb();
        console.log('weapon : ', wgInfo.id);
    }
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
        case "notApply":
            break;
        case "armor":
            return [
                {
                    identifier: 'armor',
                    name: props.player.armor.name,
                    value: mods.map(mod => props.player.getValue(mod.identifier)),
                    modifiedValue: mods.map(mod => Modifiers.tryModify(props.player.getValue(mod.identifier), [mod])),
                }
            ];
        case "helm":
            return [
                {
                    identifier: 'armor',
                    name: props.player.helm.name,
                    value: mods.map(mod => props.player.getValue(mod.identifier)),
                    modifiedValue: mods.map(mod => Modifiers.tryModify(props.player.getValue(mod.identifier), [mod])),
                }
            ];
        case "shield":
            return [
                {
                    identifier: 'armor',
                    name: props.player.shield.name,
                    value: mods.map(mod => props.player.getValue(mod.identifier)),
                    modifiedValue: mods.map(mod => Modifiers.tryModify(props.player.getValue(mod.identifier), [mod])),
                }
            ];
        case "weapon":
            return props.player.weapons.map((we, index) => {
                return {
                    identifier: 'weapon',
                    id: index,
                    name: we.name,
                    value: [...new Set(mods.map(mod => we.getModifiedValue(mod.identifier)))],
                    modifiedValue: [...new Set(mods.map(mod => Modifiers.tryModify(we.getModifiedValue(mod.identifier), [mod])))]
                };
            });
        }
    }
    return [];
};

</script>

<style scoped>

</style>