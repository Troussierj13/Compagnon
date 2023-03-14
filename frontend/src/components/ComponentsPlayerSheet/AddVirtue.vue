<template>
    <div class="flex relative h-full">
        <Button
            class="text-red"
            content="Ajouter"
            @click="tryChangeHover" />
        <div
            v-if="state.hover"
            class="flex flex-col absolute z-50 text-2xs text-black font-sansserif font-semibold leading-4 bg-white w-36 rounded border border-gray/40 p-3 shadow-md left-[125%] top-0 -translate-y-[80%] after:absolute after:content-[''] after:h-4 after:w-4 after:-rotate-45 after:-left-[0.54rem] after:top-[75%] after:translate-y-[50%] after:border-l after:border-t after:rounded-tl after:border-gray/40 after:bg-white"
            @click="tryChangeHover">
            <div
                v-for="virtue in virtuesDB"
                :key="virtue.identifier"
                class="whitespace-normal text-xs relative mb-0.5 ml-3"
            >
                <span class="break-words relative">
                    <DescribableName
                        :values="virtue?.getChosen?.() !== undefined ? virtue?.getChosen?.() : virtue.defaultInfo"
                        @click="addVirtue(virtue.identifier)" />
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
import {Virtue, VirtueIdentifier} from "@/utils/VallianceWisdom/Virtues";
import DescribableName from "./DescribableName.vue";
import {APIRequests} from "@/utils/apiurls";

interface Props {
    player: PlayerType
}

interface State {
    hover: boolean
}

const props = defineProps<Props>();
const virtuesDB = reactive<IDictionary<Partial<Virtue>>>(await APIRequests.Virtues.getAllVirtues()) as IDictionary<Partial<Virtue>>;
const state = reactive<State>({
    hover: false
});

const tryChangeHover = () => {
    state.hover = HoverSingleton.GetInstance().tryChangeHover(state.hover, () => {
        state.hover = false;
    });
};

const addVirtue = (virtueId?: VirtueIdentifier) => {
    if (virtueId !== undefined) {
        props.player.addVirtue(new Virtue(virtuesDB[virtueId]));
        props.player.saveOnDb();
    }
};

</script>