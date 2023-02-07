<template>
  <div class="flex m-auto">
    <PlayerSheet :player-json="state.players[0]" />
  </div>
</template>

<script lang="ts" setup>
import PlayerSheet from '../components/PlayerSheet.vue'
import {reactive} from "vue"
import {APIRequests} from "@/utils/apiurls"

const state = reactive({
  players: []
})

state.players = await APIRequests.getAllCharacters()

</script>
<style scoped>
</style>
