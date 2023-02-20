<template>
    <div class="relative h-full">
        <span
            class="border-red border rounded text-2xs px-1 cursor-pointer"
            @click="tryChangeHover">
            Ajouter
        </span>
        <div
            v-if="state.hover"
            class="flex flex-col absolute z-50 text-2xs text-black font-sansserif font-semibold leading-4 bg-white w-96 rounded border border-gray/40 p-3 shadow-md left-[125%] top-0 -translate-y-[90%] after:absolute after:content-[''] after:h-4 after:w-4 after:-rotate-45 after:-left-[0.54rem] after:top-[89%] after:translate-y-[50%] after:border-l after:border-t after:rounded-tl after:border-gray/40 after:bg-white"
            @click="tryChangeHover">
            <div class="flex w-full h-4 gap-1 font-sansserif font-bold text-2xs mb-2">
                <span class="grow my-auto h-2.5">
                    Nom
                </span>
                <span class="my-auto h-2.5 w-1/6 text-center">Dégats</span>
                <span class="my-auto h-2.5 w-1/6 text-center">Blessure</span>
                <span class="my-auto h-2.5 w-1/6 text-center">Charge</span>
            </div>
            <span
                v-for="weap in state.weaponsDB.filter((w) => !props.player.weapons.includes(w))"
                :key="weap"
                class="cursor-pointer hover:bg-slate-200 px-1 rounded-sm pt-0.5">
                <WeaponRow
                    :hide-note="true"
                    :weapon="weap"
                    @click.stop="addWeapon(weap)" />
            </span>
        </div>
    </div>
</template>
<script lang="ts" setup>

import {WeaponType} from "@/utils/Types/WeaponType";
import {reactive} from "vue";
import {APIRequests} from "@/utils/apiurls";
import {HoverSingleton} from "@/utils/helpers";
import {PlayerType} from "@/utils/Types/PlayerType";
import WeaponRow from "./WeaponRow.vue";

interface Props {
    player: PlayerType
}

interface State {
    weaponsDB: Array<WeaponType>;
    hover: boolean
}

const props = defineProps<Props>();
const state = reactive<State>({
    weaponsDB: await APIRequests.Weapons.getAllWeapons(),
    hover: false
});

const tryChangeHover = () => {
    state.hover = HoverSingleton.GetInstance().tryChangeHover(state.hover, () => {
        state.hover = false;
    });
};

const addWeapon = (weapon: WeaponType) => {
    tryChangeHover();

    props.player.addWeapon(weapon);
    props.player.saveOnDb();
};

</script>