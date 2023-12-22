<template>
    <span class="hover:bg-slate-200/40 rounded cursor-pointer" @click="tryChangeHover">
        {{ equip.name }}
        <span v-if="equip.skillRef && equip.skillRef !== 'unknown'">
            ( <span class="font-semibold">{{ props.player.getSkill(equip.skillRef).name }}</span> )
        </span>
    </span>
    <div
        v-if="state.hover"
        class="flex flex-col absolute right-0 -top-2.5 z-50 text-2xs text-black font-sansserif font-semibold leading-4 bg-white w-20 rounded border border-gray/40 p-3 shadow-md after:absolute after:content-[''] after:h-4 after:w-4 after:-rotate-45 after:-left-[0.54rem] after:border-l after:border-t after:rounded-tl after:border-gray/40 after:bg-white">
        <span class="pl-2 rounded hover:bg-slate-200/40 cursor-pointer" @click.prevent.stop="removeEquip">Jeter</span>
    </div>
</template>
<script lang="ts" setup>

import {PlayerType, TravelEquipment} from "../../utils/Types/PlayerType";
import {reactive} from "vue";
import {HoverSingleton} from "../../utils/helpers";

interface Props {
    player: PlayerType;
    equip: TravelEquipment
}

interface State {
    hover: boolean
}

const props = defineProps<Props>();
const state = reactive<State>({
    hover: false,
});

const tryChangeHover = () => {
    state.hover = HoverSingleton.GetInstance().tryChangeHover(state.hover, () => {
        state.hover = false;
    });
};

const removeEquip = () => {
    props.player.removeTravelEquipment(props.equip);
    props.player.saveOnDb();
};
</script>