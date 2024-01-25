<template>
  <div class="m-auto flex relative">
    <div v-if="state.ennAppear.length > 0">
      <CardEnnemy :entity="state.ennAppear[0]" :visibility="state.ennVisibility[0]" class="cursor-pointer"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {reactive} from 'vue';
import CardEnnemy from "../components/ComponentCardEnnemy/CardEnnemy.vue";
import { stateSocket } from "../socket";
import {NtagData} from "../utils/EncryptNtag";
import {VisibilityEntity} from "../utils/Types/Entity";
import {IDictionary} from "../utils/helpers";

interface State {
  ennAppear: Array<NtagData>;
  ennVisibility: IDictionary<VisibilityEntity>;
}

const state = reactive<State>({
  ennAppear: stateSocket.ennemyAppearEvents,
  ennVisibility: stateSocket.visibilityChangeEvents
});

</script>
<style scoped>
</style>
