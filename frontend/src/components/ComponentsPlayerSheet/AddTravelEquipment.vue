<template>
    <div class="relative">
        <Button
            class="absolute right-4 top-0.5 text-red"
            content="+"
            @click="tryChangeHover"/>
    </div>
    <div
        v-if="state.hover"
        class="flex flex-col absolute z-50 text-xs text-black font-sansserif font-semibold leading-4 bg-white w-80 rounded border border-gray/40 p-3 shadow-md -left-10 top-0 after:absolute after:content-[''] after:h-4 after:w-4 after:-rotate-45 after:-right-[0.54rem] after:top-0 after:translate-y-[50%] after:border-r after:border-b after:rounded-tl after:border-gray/40 after:bg-white">
        <div class="grid grid-cols-3 w-full px-2">
            <label class="mr-2" for="name">Nom :</label>
            <input
                v-model="state.name"
                class="col-span-2 p-1 h-5 my-auto rounded border border-slate-200"
                name="name"
                type="text"/>
            <label class="mr-2 mt-2 whitespace-nowrap" for="name">Compétences :</label>
            <select
                v-model="state.skillRef"
                class="col-span-2 mt-2 pl-2 text-xs text-gray-500 cursor-pointer bg-transparent">
                <option value="unknown">Aucune</option>
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
                    @click="addEquipment"/>
            </div>

        </div>
    </div>
</template>
<script lang="ts" setup>
import Button from "../Styleguide/Button.vue";
import {PlayerType} from "../../utils/Types/PlayerType";
import {SkillIdentifier} from "../../utils/Types/IdentifiedType";
import {reactive} from "vue";
import {HoverSingleton} from "../../utils/helpers";

interface Props {
    player: PlayerType;
}

interface State {
    hover: boolean
    name: string;
    skillRef: SkillIdentifier;
}

const props = defineProps<Props>();
const state = reactive<State>({
    hover: false,
    name: '',
    skillRef: 'unknown'
});

const tryChangeHover = () => {
    state.hover = HoverSingleton.GetInstance().tryChangeHover(state.hover, () => {
        state.hover = false;
    });
};

const addEquipment = () => {
    if (state.name !== "") {
        props.player.addTravelEquipment({name: state.name, skillRef: state.skillRef});
        props.player.saveOnDb();

        state.name = "";
        state.skillRef = 'unknown';
    }

    //close pop-up
    tryChangeHover();
};
</script>