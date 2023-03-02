<template>
    <TopDoubleLine class="w-[99%]" />
    <div class="relative flex flex-col h-full w-2/3 pt-2 pr-2">
        <RightSimpleLine class="h-[80%] mt-1" />
        <div class="flex w-full gap-1 font-sansserif text-[0.6rem] font-bold leading-[0.8rem]">
            <span class="relative grow flex justify-between font-UncialAntiqua text-sm font-normal text-red">
                ATTIRAIL DE GUERRE
                <AddWeapon
                    v-if="props.player.weapons.length < 4"
                    :player="props.player" />
            </span>
            <span class="my-auto h-2.5 w-1/12 text-center">Dégats</span>
            <span class="my-auto h-2.5 w-1/12 text-center">Blessure</span>
            <span class="my-auto h-2.5 w-1/12 text-center">Charge</span>
            <span class="my-auto h-2.5 w-4/12">Notes</span>
        </div>
        <div
            v-for="n in 4"
            :key="n - 1"
            class="flex grow flex-col justify-center"
        >
            <WeaponRow
                :hide-note="false"
                :player="props.player"
                :weapon="props.player.weapons[n - 1]" />
        </div>
    </div>
    <div class="flex h-full grow flex-col justify-between pt-2 pl-2 pr-2">
        <div
            class="mt-1">
            <div class="relative flex flex-col">
                <div class="mb-1 flex w-full gap-1 text-[0.6rem] leading-[0.8rem]">
                    <span class="grow font-serif font-bold">ARMURE</span>
                    <span class="my-auto h-2.5 w-1/5 text-center font-sansserif font-bold">Protection</span>
                    <span class="my-auto h-2.5 w-1/5 text-center font-sansserif font-bold">Charge</span>
                </div>
                <ArmorRow
                    :armor="props.player.armor"
                    :player="props.player"
                    @click="tryHoverModifArmor"
                />
                <ModifArmor
                    v-if="state.hover.armor"
                    :armors="state.armors.filter(arm => arm.identifier === 'armor').sort((a: ArmorType, b: ArmorType) => a.protection-b.protection)"
                    :change-identifier="'armor'"
                    :player="props.player" />
            </div>
            <div class="relative flex flex-col">
                <div class="flex w-full gap-1 text-[0.6rem] leading-[0.8rem]">
                    <span class="grow font-serif font-bold">CASQUE</span>
                </div>
                <ArmorRow
                    :armor="props.player.helm"
                    :player="props.player"
                    @click="tryHoverModifHelm" />
                <ModifArmor
                    v-if="state.hover.helm"
                    :armors="state.armors.filter(arm => arm.identifier === 'helm').sort((a: ArmorType, b: ArmorType) => a.protection.value-b.protection.value)"
                    :change-identifier="'helm'"
                    :player="props.player" />
            </div>
        </div>
        <div class="relative">
            <div class="mb-1 flex w-full gap-1 text-[0.6rem] leading-[0.8rem]">
                <span class="grow font-serif font-bold">BOUCLIER</span>
                <span class="my-auto h-2.5 w-1/5 text-center font-sansserif font-bold">Parade</span>
                <span class="my-auto h-2.5 w-1/5 text-center font-sansserif font-bold">Charge</span>
            </div>
            <ArmorRow
                :armor="props.player.shield"
                :player="props.player"
                @click="tryHoverModifShield" />
            <ModifArmor
                v-if="state.hover.shield"
                :armors="state.armors.filter(arm => arm.identifier === 'shield').sort((a: ArmorType, b: ArmorType) => a.parade.value-b.parade.value)"
                :change-identifier="'shield'"
                :player="props.player" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import {PlayerType} from "@/utils/Types/PlayerType";
import ArmorRow from "./ArmorRow.vue";
import WeaponRow from "./WeaponRow.vue";
import RightSimpleLine from "../LineComponent/RightSimpleLine.vue";
import TopDoubleLine from "../LineComponent/TopDoubleLine.vue";
import AddWeapon from "./AddWeapon.vue";
import {reactive} from "vue";
import {ArmorType} from "@/utils/Types/ArmorType";
import {APIRequests} from "@/utils/apiurls";
import ModifArmor from "./ModifArmor.vue";
import {HoverSingleton} from "@/utils/helpers";

interface Props {
    player: PlayerType
}

interface Hover {
    armor: boolean;
    helm: boolean;
    shield: boolean;
}

interface State {
    armors: Array<ArmorType>;
    hover: Hover;
}

const props = defineProps<Props>();
const state = reactive<State>({
    armors: await APIRequests.Armors.getAllArmors(),
    hover: {
        armor: false,
        helm: false,
        shield: false
    }
});

const tryHoverModifArmor = () => {
    state.hover.armor = HoverSingleton.GetInstance().tryChangeHover(state.hover.armor, () => {
        state.hover.armor = false;
    });
};

const tryHoverModifHelm = () => {
    state.hover.helm = HoverSingleton.GetInstance().tryChangeHover(state.hover.helm, () => {
        state.hover.helm = false;
    });
};

const tryHoverModifShield = () => {
    state.hover.shield = HoverSingleton.GetInstance().tryChangeHover(state.hover.shield, () => {
        state.hover.shield = false;
    });
};


</script>