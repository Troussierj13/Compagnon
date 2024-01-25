<template>
    <div class="flex flex-col relative h-full w-full justify-center items-center">
        <div id="spectator-screen" class="flex justify-center items-center w-full h-[90%]">
            <div v-if="state.ennAppear.length > 0" class="absolute top-0 left-0">
                <CardEnnemy :entity="state.ennAppear[0]" :visibility="state.ennVisibility[0]" class="cursor-pointer"/>
            </div>
            <PlayerSheet
                id="sheet"
                :player="players[0]"
                class="flex rounded scale-100"/>
        </div>
        <div id="keeper-screen" class="border-t border-red w-full h-[10%]">
            <button class="rounded bg-amber-50 px-2 m-2" @click="APIRequests.Event.sendTestEnnemy()">Appear</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {reactive} from 'vue';
import {PlayerType} from "../utils/Types/PlayerType";
import {APIRequests} from "../utils/apiurls";
import CardEnnemy from "../components/ComponentCardEnnemy/CardEnnemy.vue";
import {stateSocket} from "../socket";
import {NtagData} from "../utils/EncryptNtag";
import {VisibilityEntity} from "../utils/Types/Entity";
import {IDictionary} from "../utils/helpers";
import PlayerSheet from "../components/ComponentsPlayerSheet/PlayerSheet.vue";

let players = reactive<Array<PlayerType>>(
    await APIRequests.Character.getAllCharacters()
) as Array<PlayerType>;

interface State {
    ennAppear: Array<NtagData>;
    ennVisibility: IDictionary<VisibilityEntity>;
    sheetScale: number;
}

const state = reactive<State>({
    ennAppear: stateSocket.ennemyAppearEvents,
    ennVisibility: stateSocket.visibilityChangeEvents,
    sheetScale: 1
});
const setupWidth = () => {

    const el = document.getElementById("sheet")
    if (el) {

        state.sheetScale = (window.innerWidth / el.offsetWidth) * 0.8;
        if (state.sheetScale < 1.2) {
            el.style.setProperty('--tw-scale-x', state.sheetScale + '');
            el.style.setProperty('--tw-scale-y', state.sheetScale + '');
        }
    } else {
        setTimeout(setupWidth, 100);
    }
}

window.addEventListener('resize', setupWidth)

setupWidth()

</script>
<style scoped>
.border-gradient-red {
    --tw-gradient-from: #dc2626;
    --tw-gradient-to: #db2777;
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
    @apply absolute -inset-2 rounded-lg blur opacity-25 group-hover:opacity-50 transition-all duration-500 group-hover:duration-200
}

.bg-one-ring {
    @apply bg-cardLayoutFront bg-cover bg-clip-border bg-top bg-origin-border
}
</style>
