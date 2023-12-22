<template>
    <div class="relative w-screen h-screen">
        <div v-show="state.ennemyAppear.length > 0" class="bg-white">Angalagon appear</div>
        <div class="center-container relative">
            <div
                v-for="player in props.players.filter(el => state.elemLeft.includes(el._id) || state.elemRight.includes(el._id))"
                :key="player._id"
                class="absolute origin-center top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
                <Transition name="change-sheet">
                    <div
                        v-if="state.currentId === player._id">
                        <div class="relative group">
                            <div
                                class="border-gradient-red"></div>
                            <div
                                class="relative ring-1 ring-slate-900/5 rounded-lg">
                                <PlayerSheet
                                    :player="player"
                                    class="origin-center rounded" />
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
        <div class="vertical-container left-0">
            <div class="flex flex-col justify-center gap-6 w-full h-full">
                <div
                    v-for="playerId in state.elemLeft"
                    :key="playerId"
                    class="element-left"
                    @click="onClickPlayer(playerId)">
                    <div class="ml-auto mr-12 my-auto h-fit">
                        {{ props.players.filter(pl => pl._id === playerId)[0].name }}
                    </div>
                </div>
                <div
                    class="element-left"
                    @click="TryHoverLeft"
                >
                    <PlusIcon class="h-20 w-20 my-auto ml-auto mr-12" />
                    <div
                        v-if="state.hoverLeft"
                        class="flex flex-col absolute z-50 text-sm text-black font-sansserif font-semibold bg-white w-40 rounded border border-gray/40 p-3 shadow-md left-[110%] top-[50%] -translate-y-[50%] after:absolute after:content-[''] after:h-4 after:w-4 after:-rotate-45 after:-left-[0.54rem] after:top-[50%] after:-translate-y-[50%] after:border-l after:border-t after:rounded-tl after:border-gray/40 after:bg-white">
                        <div
                            v-for="player in props.players.filter(el => !state.elemLeft.includes(el._id) && !state.elemRight.includes(el._id))"
                            :key="player._id"
                            class="w-full rounded hover:bg-slate-200"
                            @click="state.elemLeft.push(player._id)">
                            <span class="ml-2">{{ player.name }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {PlusIcon} from "@heroicons/vue/24/solid";
import {PlayerType} from "../utils/Types/PlayerType";
import {nextTick, reactive} from "vue";
import PlayerSheet from "../components/ComponentsPlayerSheet/PlayerSheet.vue";
import {HoverSingleton} from "../utils/helpers";
import { stateSocket } from "../socket";

interface Props {
    players: Array<PlayerType>;
}

interface State {
    elemLeft: Array<string>;
    elemRight: Array<string>;
    currentId: string;
    hoverRight: boolean;
    hoverLeft: boolean;
    ennemyAppear: Array<any>;
}

const props = defineProps<Props>();
const state = reactive<State>({
    elemLeft: [],
    elemRight: [],
    currentId: "",
    hoverRight: false,
    hoverLeft: false,
    ennemyAppear: stateSocket.ennemyAppearEvents
});

const TryHoverRight = () => {
    state.hoverRight = HoverSingleton.GetInstance().tryChangeHover(state.hoverRight, () => {
        state.hoverRight = false;
    });
};

const TryHoverLeft = () => {
    state.hoverLeft = HoverSingleton.GetInstance().tryChangeHover(state.hoverLeft, () => {
        state.hoverLeft = false;
    });
};

const onClickPlayer = async (id: string) => {
    if (state.currentId == id) {
        state.currentId = '';
    } else {
        state.currentId = '';
        await nextTick(() => {
            state.currentId = id;
        });
    }
};

</script>

<style scoped>
.border-gradient-red {
  --tw-gradient-from: #dc2626;
  --tw-gradient-to: #db2777;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
  @apply absolute -inset-1 rounded-lg blur opacity-25 group-hover:opacity-50 transition-all duration-500 group-hover:duration-200
}

.vertical-container {
  @apply fixed flex h-screen w-56;
}

.center-container {
  @apply fixed h-screen w-full px-56
}

.element-left {
  @apply relative flex h-36 bg-slate-50 cursor-pointer rounded;
}

.element-right {
  @apply relative flex h-36 bg-slate-50 cursor-pointer rounded;
}
</style>