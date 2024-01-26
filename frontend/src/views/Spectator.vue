<template>
    <div id="spectator-screen" class="flex justify-center items-center w-full h-[90%]">
        <div
            v-show="state.showState.identifier == 'Entities'"
            id="entities">
            <div v-if="state.ennAppear.length > 0" class="grid grid-cols-3 gap-4 justify-center">
                <CardEnnemy :entity="state.ennAppear[0]" :visibility="state.ennVisibility[0]" class="cursor-pointer justify-center justify-self-center mx-auto"/>
            </div>
        </div>
        <div
            v-show="state.showState.identifier == 'PlayerSheet'"
            id="playersheet"
            class="flex justify-center items-center w-full">
            <PlayerSheet
                id="sheet"
                :character-id="state.game.players[0]"
                @load="setupWidth()"
                class="flex rounded scale-100"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {onUpdated, onMounted, reactive} from 'vue';
import CardEnnemy from "../components/ComponentCardEnnemy/CardEnnemy.vue";
import {stateSocket} from "../socket";
import {NtagData} from "../utils/EncryptNtag";
import {VisibilityEntity} from "../utils/Types/Entity";
import {IDictionary} from "../utils/helpers";
import PlayerSheet from "../components/ComponentsPlayerSheet/PlayerSheet.vue";
import {ShowState} from "../utils/Types/socketType";
import {GameType} from "../utils/Types/GameType";
import {APIRequests} from "../utils/apiurls";

interface State {
    game: GameType;
    ennAppear: Array<NtagData>;
    ennVisibility: IDictionary<VisibilityEntity>;
    showState: ShowState
    sheetScale: number;
}

const state = reactive<State>({
    game: await APIRequests.Games.getGame(),
    ennAppear: stateSocket.ennemyAppearEvents,
    ennVisibility: stateSocket.visibilityChangeEvents,
    showState: stateSocket.showStateEvent,
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

onMounted(() => {
    setupWidth()
});

onUpdated(() => {
    setupWidth()
});

</script>
<style scoped>
</style>
