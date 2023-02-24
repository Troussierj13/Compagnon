<template>
    <div class="m-auto flex">
        <PlayerSheet
            v-if="state.players !== null && state.weapons !== null"
            :player="state.players.at(0)"
            :weapons="state.weapons" />
    </div>
</template>

<script lang="ts" setup>
import {reactive} from 'vue';
import PlayerSheet from '../components/ComponentsPlayerSheet/PlayerSheet.vue';
import {PlayerType} from "@/utils/Types/PlayerType";
import {APIRequests} from "@/utils/apiurls";

interface State {
    players: Array<PlayerType> | unknown;
}

const state = reactive<State>({
    players: null,
});

state.players = await APIRequests.Character.getAllCharacters();
</script>
<style scoped></style>
