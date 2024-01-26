<template>
    <div class="relative flex w-full">
        <div :class="{'border-gradient-red': state.buttonHover && !disable}" class="opacity-0"></div>
        <div
            class="relative w-full rounded text-center ring-1 ring-slate-900/40 hover:ring-slate-900/0 transition-shadow bg-amber-50 cursor-pointer p-2"
            :class="{'opacity-20 hover:ring-slate-900/40 cursor-not-allowed': disable}"
            @mouseleave="state.buttonHover = false"
            @mouseover="state.buttonHover = true">
        <span class="p-4">
          {{ props.content }}
        </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {reactive} from "vue";

interface Props {
    content: string;
    disable?: boolean;
}

interface State {
    buttonHover: boolean
}

const props = defineProps<Props>();

console.log(props.disable)

const state = reactive<State>({
    buttonHover: false
})

</script>

<style scoped>
.border-gradient-red {
    --tw-gradient-from: #dc2626;
    --tw-gradient-to: #db2777;
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
    @apply absolute -inset-1 rounded-lg blur opacity-25 transition-opacity
}
</style>