<template>
    <div class="flex relative h-full">
        <Button
            class="text-red"
            content="Ajouter"
            @click="tryChangeHover" />
        <div
            v-if="state.hover"
            class="flex flex-col absolute z-50 text-2xs text-black font-sansserif font-semibold leading-4 bg-white w-80 rounded border border-gray/40 p-3 shadow-md left-[125%] top-0 -translate-y-[80%] after:absolute after:content-[''] after:h-4 after:w-4 after:-rotate-45 after:-left-[0.54rem] after:top-[75%] after:translate-y-[50%] after:border-l after:border-t after:rounded-tl after:border-gray/40 after:bg-white"
            @click="tryChangeHover">
            <div
                v-for="reward in state.rewardsDB"
                :key="reward.identifier"
                class="whitespace-normal text-xs relative mb-0.5 ml-3"
            >
                <span class="break-words relative">
                    <DescribableName
                        :values="reward.defaultChoice ? reward.defaultChoice : reward.getChosen()"
                        @click="addReward(reward.identifier)" />
                </span>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>

import {reactive} from "vue";
import {HoverSingleton, IDictionary} from "@/utils/helpers";
import {PlayerType} from "@/utils/Types/PlayerType";
import Button from "../Styleguide/Button.vue";
import DescribableName from "../DescribableName.vue";
import {dataRewards, Reward, RewardIdentifier} from "@/utils/VallianceWisdom/Rewards";

interface Props {
    player: PlayerType
}

interface State {
    rewardsDB: IDictionary<Partial<Reward>>;
    hover: boolean
}

const props = defineProps<Props>();
const state = reactive<State>({
    rewardsDB: dataRewards,
    hover: false
});

const tryChangeHover = () => {
    state.hover = HoverSingleton.GetInstance().tryChangeHover(state.hover, () => {
        state.hover = false;
    });
};

const addReward = (rewardId: RewardIdentifier) => {
    props.player.addReward(new Reward(state.rewardsDB[rewardId]));
    props.player.saveOnDb();
};

</script>