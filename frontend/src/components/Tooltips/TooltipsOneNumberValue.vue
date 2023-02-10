<template>
    <div class="mx-5">
        <div class="flex flex-col">
            <ChevronDoubleUpIcon
                class="mx-auto h-6 w-6"
                @click="addToPlayerValue(5)"
            />
            <ChevronUpIcon
                class="mx-auto h-6 w-6"
                @click="addToPlayerValue(1)"
            />
            <span class="mx-auto w-fit select-none">{{
                getPlayerValue()
            }}</span>
            <ChevronDownIcon
                class="mx-auto h-6 w-6"
                @click="addToPlayerValue(-1)"
            />
            <ChevronDoubleDownIcon
                class="mx-auto h-6 w-6"
                @click="addToPlayerValue(-5)"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    Identifier,
    IdentifierModifiableAttr,
} from '@/utils/Types/IdentifiedType';
import { PlayerType } from '@/utils/Types/PlayerType';
import {
    ChevronDoubleDownIcon,
    ChevronDoubleUpIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from '@heroicons/vue/24/solid';

interface Params {
    player: PlayerType;
    identifierAttr: Identifier | IdentifierModifiableAttr;
}

interface Props {
    modelValue: Params;
}

const props = defineProps<Props>();

const getPlayerValue = (): number => {
    return props.modelValue.player.getModifiedValue(
        props.modelValue.identifierAttr
    );
};

const addToPlayerValue = (add: number) => {
    return props.modelValue.player.setValue(
        props.modelValue.identifierAttr,
        props.modelValue.player.getModifiedValue(
            props.modelValue.identifierAttr
        ) + add
    );
};
</script>

<style scoped></style>
