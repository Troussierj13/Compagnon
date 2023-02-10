<template>
    <div class="m-auto flex">
        <Socket />
        <PlayerSheet :player-json="data.players[0]" />
    </div>
</template>

<script lang="ts" setup>
import { data } from '@/utils/data';
import { reactive } from 'vue';
import PlayerSheet from '../components/PlayerSheet.vue';
import Socket from '../components/Socket.vue';

const state = reactive({
    players: [],
});

//state.players = await APIRequests.getAllCharacters()
</script>
<style scoped></style>
