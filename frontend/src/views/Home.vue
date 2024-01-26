<template>
    <div class="m-auto flex relative h-full justify-center items-center">
        <div class="flex h-full w-full justify-center items-center">
            <GameMode v-if="state.selectedGame"/>
            <GameSelection v-else :game="state.game" :handlerSelect="(select: GameType) => {state.selectedGame = select}"></GameSelection>
        </div>
    </div>
</template>

<script lang="ts" setup>
import GameMode from "./GameMode.vue";
import {reactive} from "vue";
import GameSelection from "./GameSelection.vue";
import {APIRequests} from "../utils/apiurls";
import {GameType} from "../utils/Types/GameType";

interface State {
    game: GameType;
    selectedGame: GameType | undefined
}

const state = reactive<State>({
    game: await APIRequests.Games.getGame(),
    selectedGame: undefined
})

</script>

<style scoped>
</style>