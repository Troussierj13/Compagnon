<template>
    <div class="m-auto flex relative h-full justify-center items-center">
        <div class="flex justify-center">
            <div
                :class="{'pt-14': props.game.name != ''}"
                class="flex flex-col justify-between pb-8 pt-16 items-center space-y-6 rounded bg-one-ring h-64 aspect-[9/7]">
                <div class="flex flex-col justify-center gap-1">
                    <div class="flex justify-center gap-1">
                        <span v-if="props.game.name != ''" class="text-sm font-sansserif font-semibold">Partie en cours :</span>
                        <span v-else class="text-sm font-sansserif font-bold">Aucune partie en cours</span>
                    </div>
                    <div v-if="props.game.name != ''" class="flex items-center gap-2">
                        <span class="relative flex h-2 w-2">
                          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span class="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                        </span>
                        <span class="text-sm font-sansserif font-bold">{{props.game.name}}</span>
                    </div>
                </div>
                <div class="flex flex-col gap-4 items-center">
                    <PrincipalButton content="Rejoindre cette partie" :disable="props.game.name == ''" class="text-sm w-64" @click="joinGame(props.game)"></PrincipalButton>
                    <PrincipalButton content="Créer un nouvelle partie" class="text-sm w-64" @click="createGame"></PrincipalButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import PrincipalButton from "../components/Styleguide/PrincipalButton.vue";
import {GameType} from "../utils/Types/GameType";
import {APIRequests} from "../utils/apiurls";

interface Props {
    game: GameType;
    handlerSelect: void
}

const props = defineProps<Props>()

const createGame = async () => {
    const nGame = await APIRequests.Games.createGame('Session du ' + new Date().toLocaleDateString())
    joinGame(nGame)
}

const joinGame = (jGame: GameType) => {
    if(jGame.name != '')
        props.handlerSelect(jGame)
}
</script>

<style scoped>
.bg-one-ring {
    @apply bg-cardLayoutFront bg-cover bg-clip-border bg-top bg-origin-border
}
</style>
