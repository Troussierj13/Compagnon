<template>
    <div class="position-tooltips relative text-lg">
        <div class="simple-border absolute inset-0 z-50 flex h-full w-full"/>
        <div class="relative h-full w-full p-1">
            <div class="h-full w-full bg-sheet bg-cover p-1">
                <component :is="children" v-model="model"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {Identifier, IdentifierModifiableAttr,} from '../../utils/Types/IdentifiedType';
import {PlayerType} from '../../utils/Types/PlayerType';
import {reactive} from 'vue';
import {Vector2Rect} from "../../utils/helpers";

interface Props {
    children: Object;
    player: PlayerType;
    identifierAttr: Identifier | IdentifierModifiableAttr;
    position: Vector2Rect<string>;
}

interface State {
    player: PlayerType;
    identifierAttr: Identifier | IdentifierModifiableAttr;
}

const props = defineProps<Props>();

const model = reactive<State>({
    player: props.player,
    identifierAttr: props.identifierAttr,
});
</script>

<style scoped>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

.simple-border {
    border: 10px solid;
    border-image-repeat: stretch;
    border-image-slice: 18 18 18 18;
    z-index: 0;
    border-image-source: theme('backgroundImage.redBorderSimple');
}

.position-tooltips {
    top: v-bind('props.position.top');
    @apply -translate-y-[50%];
    left: v-bind('props.position.left');
}
</style>
