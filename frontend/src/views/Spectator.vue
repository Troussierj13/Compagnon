<template>
    <div
        ref="parent"
        class="relative flex flex-col justify-center items-center w-full h-full">
        <div
            v-show="state.showState.identifier == 'Entities'">
            <div v-if="state.ennAppear.length > 0" class="relative flex justify-center">
                <CardEnnemy :entity="state.ennAppear[0]" :visibility="state.ennVisibility[0]" class="cursor-pointer"/>
            </div>
        </div>
        <div v-show="state.showState.identifier == 'PlayerSheet'"
             class="relative flex justify-between w-full h-full">
            <div class="absolute flex h-full w-[15%] -left-1">
                <div class="w-full h-full gradient-mask bg-gradient-to-t from-black/80 to-black/40 backdrop-blur">
                    <ChatMessage/>
                </div>
            </div>
            <div
                v-if="state.characters[state.currentCharacter[0]]"
                ref="sheet"
                class="absolute flex justify-center items-center w-[85%] h-full right-0 mt-auto">
                <PlayerSheet
                    :character="state.characters[state.currentCharacter[0]]"
                    @load="setupWidthHeight()"
                    class="flex rounded scale-100"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, onUpdated, reactive, ref} from 'vue';
import CardEnnemy from "../components/ComponentCardEnnemy/CardEnnemy.vue";
import {stateSocket} from "../socket";
import {NtagData} from "../utils/EncryptNtag";
import {VisibilityEntity} from "../utils/Types/Entity";
import {IDictionary} from "../utils/helpers";
import PlayerSheet from "../components/ComponentsPlayerSheet/PlayerSheet.vue";
import {ShowState} from "../utils/Types/socketType";
import {GameType} from "../utils/Types/GameType";
import {APIRequests} from "../utils/apiurls";
import {PlayerType} from "../utils/Types/PlayerType";
import ChatMessage from "../components/ComponentsSpectatorSheet/ChatMessage.vue";

interface Props {
    showState?: ShowState
}
interface State {
    game: GameType;
    characters: IDictionary<PlayerType>;
    currentCharacter: Array<string>;
    ennAppear: Array<NtagData>;
    ennVisibility: IDictionary<VisibilityEntity>;
    showState: ShowState
    sheetScale: number;
}

const props = defineProps<Props>()

const state = reactive<State>({
    game: await APIRequests.Games.getGame(),
    characters: await APIRequests.Character.getAllCharacters(),
    currentCharacter: stateSocket.characterSheetEvent,
    ennAppear: stateSocket.ennemyAppearEvents,
    ennVisibility: stateSocket.visibilityChangeEvents,
    showState: props.showState ? props.showState : stateSocket.showStateEvent,
    sheetScale: 1
});

const parent = ref<HTMLElement | null>(null);
const sheet = ref<HTMLElement | null>(null);

const setupWidthHeight = () => {

    if (sheet.value && sheet.value.children.length > 0 && parent.value?.offsetWidth) {
        let sh = sheet.value.children.item(0) as HTMLElement
        state.sheetScale = (parent.value.offsetWidth / sh.clientWidth) * 0.8;

        if (state.sheetScale < 1.2) {
            sh.style.setProperty('--tw-scale-x', state.sheetScale + '');
            sh.style.setProperty('--tw-scale-y', state.sheetScale + '');
        }
    } else {
        setTimeout(setupWidthHeight, 50);
    }
}

if(state.showState.identifier == "PlayerSheet")
    window.addEventListener('resize', setupWidthHeight)

onMounted(() => {
    if(state.showState.identifier == "PlayerSheet")
        setupWidthHeight()
});

onUpdated(() => {
    if(state.showState.identifier == "PlayerSheet")
        setupWidthHeight()
});

</script>

<style scoped>
.gradient-mask {
    //-webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 25%);
    mask-image: linear-gradient(to bottom, transparent 0%, black 25%);
}
</style>