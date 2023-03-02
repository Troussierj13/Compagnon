<template>
    <div class="relative h-full">
        <TopSimpleLine class="left-2 -top-1" />
        <div class="flex flex-col h-full pt-1">
            <div class="relative">
                <Button
                    class="absolute right-4 top-0.5 text-red"
                    content="+"
                    @click="tryChangeHover" />
            </div>
            <div
                v-if="state.hover"
                class="flex flex-col absolute z-50 text-xs text-black font-sansserif font-semibold leading-4 bg-white w-80 rounded border border-gray/40 p-3 shadow-md -left-10 top-0 after:absolute after:content-[''] after:h-4 after:w-4 after:-rotate-45 after:-right-[0.54rem] after:top-0 after:translate-y-[50%] after:border-r after:border-b after:rounded-tl after:border-gray/40 after:bg-white">
                <div class="grid grid-cols-3 w-full px-2">
                    <label class="mr-2" for="name">Nom :</label>
                    <input
                        v-model="state.equipementName"
                        class="col-span-2 p-1 h-5 my-auto rounded border border-slate-200"
                        name="name"
                        type="text" />
                    <label class="mr-2 mt-2 whitespace-nowrap" for="name">Compétences :</label>
                    <select
                        v-model="state.equipmentSkillRef"
                        class="col-span-2 mt-2 pl-2 text-xs text-gray-500 bg-transparent">
                        <option selected value="">Aucune</option>
                        <option value="awe">Présence</option>
                        <option value="athletics">Athlétisme</option>
                        <option value="awareness">Vigilance</option>
                        <option value="hunting">Chasse</option>
                        <option value="song">Chant</option>
                        <option value="craft">Artisanat</option>
                        <option value="enhearten">Inspiration</option>
                        <option value="travel">Voyage</option>
                        <option value="insight">Intuition</option>
                        <option value="healing">Soins</option>
                        <option value="courtesy">Courtoisie</option>
                        <option value="battle">Art de la guerre</option>
                        <option value="persuade">Persuasion</option>
                        <option value="stealth">Discrétion</option>
                        <option value="scan">Inspection</option>
                        <option value="explore">Exploration</option>
                        <option value="riddle">Enigmes</option>
                        <option value="lore">Connaissances</option>
                    </select>
                    <span class="ml-3 text-slate-400">( Optionnel )</span>
                    <span class="col-span-2"></span>
                    <div class="mt-4 col-span-3 flex justify-center">
                        <Button
                            class="text-red text-sm"
                            content="Ajouter"
                            @click="addEquipment" />
                    </div>

                </div>
            </div>
            <span class="text-sm mx-auto mb-2 text-center text-red">EQUIPEMENT DE VOYAGE</span>
            <div
                v-for="(equip, index) in props.player.travelEquipment"
                :key="index"
                class="scroll-bar-red flex flex-col grow max-h-20 overflow-auto text-xs pl-4"
            >
                <span>
                    {{ equip.name }}
                    <span v-if="equip.skillRef !== 'unknown'">
                        ( <span class="font-semibold">{{ props.player.getSkill(equip.skillRef).name }}</span> )
                    </span>
                </span>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>

import {PlayerType} from "@/utils/Types/PlayerType";
import TopSimpleLine from "../LineComponent/TopSimpleLine.vue";
import Button from "../Styleguide/Button.vue";
import {HoverSingleton} from "@/utils/helpers";
import {reactive} from "vue";
import {SkillIdentifier} from "@/utils/Types/IdentifiedType";

interface Props {
    player: PlayerType;
}

interface State {
    hover: boolean
    equipementName: string;
    equipmentSkillRef: SkillIdentifier;
}

const props = defineProps<Props>();
const state = reactive<State>({
    hover: false,
    equipementName: "",
    equipmentSkillRef: 'unknown'
});

const tryChangeHover = () => {
    state.hover = HoverSingleton.GetInstance().tryChangeHover(state.hover, () => {
        state.hover = false;
    });
};

const addEquipment = () => {
    if (state.equipementName !== "" && state.equipmentSkillRef !== 'unknown') {
        props.player.addTravelEquipement({name: state.equipementName, skillRef: state.equipmentSkillRef});
        props.player.saveOnDb();
    }
};
</script>