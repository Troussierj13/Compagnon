<template>
    <div class="m-auto flex relative">
      <div v-if="state.ennAppear.length > 0">
        <CardEnnemy :entity="state.ennAppear[0]" :visibility="state.ennVisibility[0]" class="cursor-pointer"/>
        <EdgeDisplaySystem :players="players" />
      </div>
      <button v-else class="rounded bg-amber-50 px-2 m-2" @click="APIRequests.Event.sendTestEnnemy()">Appear</button>
    </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue';
import {PlayerType} from "../utils/Types/PlayerType";
import {APIRequests} from "../utils/apiurls";
import EdgeDisplaySystem from "./EdgeDisplaySystem.vue";
import CardEnnemy from "../components/ComponentCardEnnemy/CardEnnemy.vue";
import { stateSocket } from "../socket";
import {NtagData} from "../utils/EncryptNtag";
import EditCardEnnemy from "../components/ComponentCardEnnemy/EditCardEnnemy.vue";
import {VisibilityEntity} from "../utils/Types/Entity";
import {IDictionary} from "../utils/helpers";

let players = reactive<Array<PlayerType>>(
    await APIRequests.Character.getAllCharacters()
) as Array<PlayerType>;

interface State {
  ennAppear: Array<NtagData>;
  ennVisibility: IDictionary<VisibilityEntity>;
}

const state = reactive<State>({
  ennAppear: stateSocket.ennemyAppearEvents,
  ennVisibility: stateSocket.visibilityChangeEvents
});


const entity = ref<NtagData>({
  isHorde: false,
  nbrOnHorde: 1,
  displayMode: 1,
  name: '',
  surname: '',
  characteristicsName: [],
  lvlAttribute: 0,
  endurance: 0,
  power: 0,
  haveHate: false,
  valueHM: 0,
  parade: 0,
  armor: 0,
  weapons: [],
  specifications: [],
  description:'',
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
