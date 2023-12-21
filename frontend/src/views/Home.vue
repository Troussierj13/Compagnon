<template>
    <div class="m-auto flex relative">
        <EdgeDisplaySystem :players="players" />
    </div>
</template>

<script lang="ts" setup>
import {reactive} from 'vue';
import {PlayerType} from "@/utils/Types/PlayerType";
import {APIRequests} from "../utils/apiurls";
import EdgeDisplaySystem from "./EdgeDisplaySystem.vue";

let players = reactive<Array<PlayerType>>(
    await APIRequests.Character.getAllCharacters()
) as Array<PlayerType>;


</script>
<style scoped></style>
