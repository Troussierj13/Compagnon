<template>
    <div class="flex flex-col relative h-full w-full justify-center items-center">
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
                    :player="players[0]"
                    @load="setupWidth()"
                    class="flex rounded scale-100"/>
            </div>
        </div>
        <div id="keeper-screen" class="border-t border-red w-full h-[10%]">
            <button class="rounded bg-amber-50 px-2 m-2" @click="APIRequests.Event.sendTestEnnemy()">Appear</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {reactive, onUpdated} from 'vue';
import {PlayerType} from "../utils/Types/PlayerType";
import {APIRequests} from "../utils/apiurls";
import CardEnnemy from "../components/ComponentCardEnnemy/CardEnnemy.vue";
import {stateSocket} from "../socket";
import {NtagData} from "../utils/EncryptNtag";
import {VisibilityEntity} from "../utils/Types/Entity";
import {IDictionary} from "../utils/helpers";
import PlayerSheet from "../components/ComponentsPlayerSheet/PlayerSheet.vue";
import {ShowState} from "../utils/Types/socketType";

let players = reactive<Array<PlayerType>>(
    await APIRequests.Character.getAllCharacters()
) as Array<PlayerType>;

interface State {
    ennAppear: Array<NtagData>;
    ennVisibility: IDictionary<VisibilityEntity>;
    showState: ShowState
    sheetScale: number;
}

const state = reactive<State>({
    ennAppear: stateSocket.ennemyAppearEvents,
    ennVisibility: stateSocket.visibilityChangeEvents,
    showState: stateSocket.showStateEvent,
    sheetScale: 1
});


</script>
<style scoped>
</style>
