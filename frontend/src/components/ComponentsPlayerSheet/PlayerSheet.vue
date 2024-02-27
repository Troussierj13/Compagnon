<template>
    <div
        class="relative flex min-w-[85rem] max-w-[85rem] aspect-[1080/690] border-t-80 border-b-56 border-red/0 bg-sheet bg-cover bg-clip-border bg-center bg-origin-border">
        <div
            class="absolute -top-20 h-20 w-full bg-topSheet bg-contain bg-center brightness-75 contrast-125 saturate-150"></div>
        <div
            class="absolute -bottom-14 h-16 w-full bg-bottomSheet bg-cover bg-clip-border bg-center bg-origin-border"></div>
        <div class="flex h-full w-[74.2%] flex-col border-l-18 border-red/0">
            <div class="h-24 w-full">
                <HeaderPlayerSheet :values="props.character.getHeaderValues()"/>
            </div>
            <div class="relative flex flex-col w-full grow">
                <RightDoubleLine/>
                <div class="flex flex-col h-full w-full">
                    <div class="relative flex grow">
                        <div class="flex flex-col h-full w-1/3">
                            <StrengthColumn :player="props.character"/>
                        </div>
                        <div class="flex flex-col h-full w-1/3">
                            <HeartColumn :player="props.character"/>
                        </div>
                        <div class="flex flex-col h-full w-1/3">
                            <MindColumn :player="props.character"/>
                        </div>
                    </div>
                    <div class="relative flex h-1/5 w-full pt-1">
                        <WarGear :player="props.character"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex h-full w-[24.7%] flex-col border-r-18 border-red/0 px-1">
            <div class="flex h-1/3 flex-col p-3">
                <div class="simple-border h-full w-full"/>
            </div>
            <div class="flex grow flex-col">
                <XpSecondaryPoints :player="props.character"/>
            </div>
            <div class="flex h-1/6">
                <States :player="props.character"/>
            </div>
            <div class="relative flex h-1/5 flex-col">
                <TravelEquipment :player="props.character"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {PlayerType} from '../../utils/Types/PlayerType';
import HeaderPlayerSheet from './HeaderPlayerSheet.vue';
import RightDoubleLine from "../LineComponent/RightDoubleLine.vue";
import StrengthColumn from "./StrengthColumn.vue";
import HeartColumn from "./HeartColumn.vue";
import MindColumn from "./MindColumn.vue";
import WarGear from "./WarGear.vue";
import XpSecondaryPoints from "./XpSecondaryPoints.vue";
import States from "./States.vue";
import TravelEquipment from "./TravelEquipmentList.vue";
import {reactive} from "vue";
import {APIRequests} from "../../utils/apiurls";

interface State {
    character: PlayerType
}

const props = defineProps<{
    character: PlayerType;
}>();

/*const state = reactive<State>({
    character: await APIRequests.Character.getCharacter(props.characterId)
})*/

</script>

