<template>
    <div
        class="flex font-medium cursor-pointer"
        @click.prevent.stop="tryChangeHover">
        <span class="relative z-10 font-UncialAntiqua whitespace-nowrap">
            {{ props.values.name }}
        </span>
        <InformationCircleIcon class="relative z-10 h-3 w-3 ml-2 mb-auto"/>
        <div
            v-if="state.hover"
            class="flex absolute z-50 text-xs font-sansserif font-semibold leading-4 bg-white rounded border border-gray/40 p-3 shadow-md top-6 after:absolute after:content-[''] after:h-4 after:w-4 after:rotate-45 after:-top-[0.54rem] after:border-l after:border-t after:rounded-tl after:border-gray/40 after:bg-white">
            {{ props.values.description }}
        </div>
    </div>
</template>

<script lang="ts" setup>

import {InformationCircleIcon} from '@heroicons/vue/24/outline';
import {DescribableName, HoverSingleton} from "../utils/helpers";
import {reactive} from "vue";

interface Props {
    values: DescribableName;
}

interface State {
    hover: boolean;
}

const props = defineProps<Props>();
const state = reactive<State>({
    hover: false
});

const tryChangeHover = () => {
    state.hover = HoverSingleton.GetInstance().tryChangeHover(state.hover, () => {
        state.hover = false;
    });
};

</script>

<style scoped>

</style>