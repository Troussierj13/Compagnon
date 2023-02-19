<template>
    <div class="relative flex w-fit mx-auto">
        <span
            :class="{ 'diamond-md' : props.sizeDiamond === 'medium', 'diamond-lg' : props.sizeDiamond === 'large' }"
            class="diamond cursor-pointer select-none"
            @click="tryChangeHover">
            <span v-if="props?.strToZero">
                <span v-if="props.player.getModifiedValue(props.identifierAttr) > 0">
                    {{ props.player.getModifiedValue(props.identifierAttr) }}
                </span>
                <span v-else>
                    {{ props.strToZero }}
                </span>
            </span>
            <span v-else>{{ props.player.getModifiedValue(props.identifierAttr) }}</span>
        </span>
        <TooltipsOneNumberValue
            v-show="state.hover"
            :identifier-attr="props.identifierAttr"
            :player="props.player" />
    </div>
</template>
<script lang="ts" setup>

import {PlayerType} from "@/utils/Types/PlayerType";
import TooltipsOneNumberValue from "../Tooltips/TooltipsOneNumberValue.vue";
import {Identifier, IdentifierModifiableAttr} from "@/utils/Types/IdentifiedType";
import {reactive} from "vue";
import {HoverSingleton} from "@/utils/helpers";

type StateClick = 'unknown' | 'simple' | 'double';
type SizeDiamond = 'medium' | 'large';

interface Props {
    player: PlayerType;
    identifierAttr: Identifier | IdentifierModifiableAttr;
    sizeDiamond: SizeDiamond;
    strToZero?: string;
}

interface State {
    stateClick: StateClick;
    hover: boolean
}

const props = defineProps<Props>();
const state = reactive<State>({
    stateClick: 'unknown',
    hover: false
});

const tryChangeHover = () => {
    state.hover = HoverSingleton.GetInstance().tryChangeHover(state.hover, () => {
        state.hover = false;
        props.player.saveOnDb();
    });
};

</script>