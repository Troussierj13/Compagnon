<template>
  <div class="flex m-auto">
    <Socket />
    <PlayerSheet :player-json="state.players[0]" />
  </div>
</template>

<script lang="ts" setup>
import PlayerSheet from '../components/PlayerSheet.vue'
import Socket from '../components/Socket.vue';
import {reactive} from "vue"
import {APIRequests} from "@/utils/apiurls"

const state = reactive({
  players: []
})

state.players = await APIRequests.getAllCharacters()

</script>
<style scoped>
</style>
