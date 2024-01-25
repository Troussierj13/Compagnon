<template>
    <div
        class="absolute z-50 flex -translate-x-[100%] -translate-y-[50%] top-4 -left-3">
        <div class="absolute h-full w-full simple-border"></div>
        <div
            class="flex flex-col z-50 text-xs font-sansserif font-semibold leading-4 m-[0.2rem] p-2 bg-sheet bg-cover bg-center">
            <ChevronDoubleUpIcon
                class="mx-auto h-6 w-6 cursor-pointer"
                @click="addToPlayerValue(5)"
            />
            <ChevronUpIcon
                class="mx-auto h-6 w-6 cursor-pointer"
                @click="addToPlayerValue(1)"
            />
            <span class="mx-auto w-fit select-none">{{
                    getPlayerValue()
                }}</span>
            <ChevronDownIcon
                class="mx-auto h-6 w-6 cursor-pointer"
                @click="addToPlayerValue(-1)"
            />
            <ChevronDoubleDownIcon
                class="mx-auto h-6 w-6 cursor-pointer"
                @click="addToPlayerValue(-5)"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import {Identifier, IdentifierModifiableAttr,} from '../../utils/Types/IdentifiedType';
import {PlayerType} from '../../utils/Types/PlayerType';
import {ChevronDoubleDownIcon, ChevronDoubleUpIcon, ChevronDownIcon, ChevronUpIcon,} from '@heroicons/vue/24/solid';

interface Props {
    player: PlayerType;
    identifierAttr: Identifier | IdentifierModifiableAttr;
}

const props = defineProps<Props>();

const getPlayerValue = (): number => {
    return props.player.getModifiedValue(
        props.identifierAttr
    );
};

const addToPlayerValue = (add: number) => {
    props.player.setValue(
        props.identifierAttr,
        props.player.getModifiedValue(
            props.identifierAttr
        ) + add
    );
};
</script>

<style scoped></style>
