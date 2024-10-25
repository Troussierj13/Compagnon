<template>
    <div class="z-10 flex mx-auto gap-4 pt-4 bg-amber-50/20 backdrop-blur rounded-b-2xl">
        <div
            v-for="(player, playerIndex) in props.players" :key="playerIndex"
            class="flex flex-col justify-between items-center cursor-pointer h-24 w-24"
            @click="APIRequests.Games.emitCharacterSheet(player).then()">
            <UserIcon class="h-14 w-14 rounded-full bg-black/40 text-amber-50"></UserIcon>
            <span class="rounded-full bg-amber-50 py-1 px-3 text-xs text-black">{{props.characters[player].name}}</span>
        </div>
    </div>
</template>


<script lang="ts" setup>
import {UserIcon} from "@heroicons/vue/24/solid";
import {APIRequests} from "../../utils/apiurls";
import {IDictionary} from "../../utils/helpers";
import {PlayerType} from "../../utils/Types/PlayerType";
import TopSimpleLine from "../LineComponent/TopSimpleLine.vue";

interface Props {
    players: Array<string>;
    characters: IDictionary<PlayerType>
}
const props = defineProps<Props>()

</script>