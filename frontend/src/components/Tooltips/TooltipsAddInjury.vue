<template>
    <div
        class="absolute z-50 flex -translate-y-[100%] translate-x-[50%] top-4 -left-3">
        <div class="absolute h-full w-full simple-border"></div>
        <div
            class="flex flex-col gap-2 z-50 text-xs font-sansserif font-semibold leading-4 m-[0.2rem] p-4 bg-sheet bg-cover bg-center">
            <span>Gravité de la blessure</span>
            <div class="flex text-sm">
                <input
                    v-model="state.injury.value"
                    class="w-10 p-1 h-6 my-auto"
                    name="value"
                    type="number" />
                <select
                    v-model="state.injury.unit"
                    class="block py-1 pl-2 pr-4 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-gray-200">
                    <option value="hours">Heures</option>
                    <option value="days">Jours</option>
                </select>
            </div>
            <button
                class="bg-transparent w-16 mx-auto text-blue-700 hover:text-red font-semibold border py-1 border-red rounded"
                @click="addInjury">
                Valider
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {Injuries, PlayerType} from '@/utils/Types/PlayerType';
import {reactive} from "vue";
import {HoverSingleton} from "@/utils/helpers";

interface Props {
    player: PlayerType
}

interface State {
    injury: Injuries
}

const props = defineProps<Props>();

const state = reactive<State>({
    injury: {
        value: 0,
        unit: 'hours'
    }
});

const addInjury = () => {
    props.player.addInjury(state.injury);

    props.player.saveOnDb();

    HoverSingleton.GetInstance().tryChangeHover(true, () => {
    });
};
</script>

<style scoped></style>
