<template>
    <div class="relative flex flex-col h-full w-full">
        <TopSimpleLine class="-top-2 left-2" />
        <div class="relative flex flex-col">
            <span class="text-sm mx-auto mb-2 text-center text-red">ETATS</span>
            <div class="flex pl-4">
                <div class="flex h-full w-1/2 flex-col gap-1">
                    <div class="flex">
                        <span class="square mr-2 cursor-not-allowed">
                            <span
                                v-if="props.player.states.exhaust"
                                class="absolute h-3 w-3 rotate-45 bg-check bg-cover bg-center bg-no-repeat"
                            />
                        </span>
                        <span class="my-auto font-serif text-xs font-semibold leading-3">Epuisé</span>
                    </div>
                    <div class="flex">
                        <span class="square mr-2 cursor-not-allowed">
                            <span
                                v-if="props.player.states.melancholic"
                                class="absolute h-3 w-3 rotate-45 bg-check bg-cover bg-center bg-no-repeat"
                            />
                        </span>
                        <span class="my-auto font-serif text-xs font-semibold leading-3">Mélancolique</span>
                    </div>
                    <div class="flex relative">
                        <span
                            class="square mr-2 cursor-pointer"
                            @click="changeInjury">
                            <span
                                v-if="props.player.states.hurt"
                                class="absolute h-3 w-3 rotate-45 bg-check bg-cover bg-center bg-no-repeat"
                            />
                        </span>
                        <span class="my-auto font-serif text-xs font-semibold leading-3">Blessé</span>
                        <TooltipsAddInjury
                            v-show="state.hover"
                            :player="props.player" />
                    </div>
                </div>
                <div class="flex h-full w-1/2 flex-col">
                    <span class="my-auto font-serif text-xs font-semibold italic leading-3">Blessure</span>
                    <span class="rect w-24 text-sm">
                        <span v-if="props.player.states.injuries.value > 0">
                            {{ props.player.states.injuries.value + ' ' + props.player.states.injuries.unit }}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>

import {PlayerType} from "@/utils/Types/PlayerType";
import TopSimpleLine from "../LineComponent/TopSimpleLine.vue";
import {reactive} from "vue";
import {HoverSingleton} from "@/utils/helpers";
import TooltipsAddInjury from "../Tooltips/TooltipsAddInjury.vue";

interface Props {
    player: PlayerType;
}

interface State {
    hover: boolean;
}

const props = defineProps<Props>();
const state = reactive<State>({
    hover: false
});

const changeInjury = () => {
    if (props.player.states.injuries.value > 0) {
        props.player.removeInjury();
    } else {
        tryChangeHover();
    }
};

const tryChangeHover = () => {
    state.hover = HoverSingleton.GetInstance().tryChangeHover(state.hover, () => {
        state.hover = false;
    });
};

</script>