<template>
    <div class="m-auto flex">
        <Socket />
        <PlayerSheet :player-json="data.players[0]" :weapons="state.weapons" />
    </div>
</template>

<script lang="ts" setup>
import {data} from '@/utils/data';
import {reactive} from 'vue';
import PlayerSheet from '../components/ComponentsPlayerSheet/PlayerSheet.vue';
import Socket from '../components/Socket.vue';
import {PlayerType} from "@/utils/Types/PlayerType";
import {APIRequests} from "@/utils/apiurls";
import {WeaponType} from "@/utils/Types/WeaponType";

interface State {
    players: Array<PlayerType>;
    weapons: Array<WeaponType>;
}

const state = reactive<State>({
    players: [],
    weapons: await APIRequests.getAllWeapons()
});

//state.players = await APIRequests.getAllCharacters();
</script>
<style scoped></style>
