<template>
    <div class="m-auto flex relative">
      <CardEnnemy />
      <div v-if="state.ennAppear.length > 0" class="absolute flex justify-center items-center font-sansserif font-black bg-gray/50 h-full w-full">
        <div class="relative group flex">
          <div class="border-gradient-red rounded"></div>
          <div @click="state.ennAppear.pop()" class="relative rounded">
            <div class="p-10 max-w-7xl rounded-lg bg-sheet bg-cover bg-clip-border bg-center bg-origin-border">{{ state.ennAppear[0]}}</div>
          </div>
        </div>
      </div>
      <!-- <EdgeDisplaySystem :players="players" /> -->
    </div>
</template>

<script lang="ts" setup>
import {reactive} from 'vue';
import {PlayerType} from "../utils/Types/PlayerType";
import {APIRequests} from "../utils/apiurls";
import EdgeDisplaySystem from "./EdgeDisplaySystem.vue";
import CardEnnemy from "../components/ComponentCardEnnemy/CardEnnemy.vue";
import { stateSocket } from "../socket";
import {EncrypteNtag} from "../utils/EncryptNtag";

let players = reactive<Array<PlayerType>>(
    await APIRequests.Character.getAllCharacters()
) as Array<PlayerType>;

interface State {
  ennAppear: Array<any>;
}

const state = reactive<State>({
  ennAppear: stateSocket.ennemyAppearEvents
});
</script>
<style scoped>
.border-gradient-red {
  --tw-gradient-from: #dc2626;
  --tw-gradient-to: #db2777;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
  @apply absolute -inset-2 rounded-lg blur opacity-25 group-hover:opacity-50 transition-all duration-500 group-hover:duration-200
}
</style>
