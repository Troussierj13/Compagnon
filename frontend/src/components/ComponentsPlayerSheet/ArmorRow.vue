<template>
    <div class="flex w-full gap-1 font-sansserif font-bold text-[0.6rem] leading-[0.8rem]">
        <span
            class="relative flex grow h-[1.125rem] rounded hover:bg-slate-200/40 cursor-pointer">
            {{ getName() }}
            <BottomGrayLine />
        </span>
        <span class="relative flex w-1/5 justify-center h-[1.125rem] my-auto">
            {{ getProtectionParade() }}
            <BottomGrayLine />
        </span>
        <span class="relative flex w-1/5 justify-center h-[1.125rem] my-auto">
            {{ getWeight() }}
            <BottomGrayLine />
        </span>
    </div>
</template>

<script lang="ts" setup>
import BottomGrayLine from "../LineComponent/BottomGrayLine.vue";
import {PlayerType} from "@/utils/Types/PlayerType";
import {ArmorType} from "@/utils/Types/ArmorType";

interface Props {
    player?: PlayerType;
    armor: ArmorType;
}

const props = defineProps<Props>();

const getWeight = () => {
    if (props.player) {
        switch (props.armor.identifier) {
        case "unknown":
            return '';
        case "armor":
            return props.player.getModifiedValue('armorWeight');
        case "helm":
            return props.player.getModifiedValue('helmWeight');
        case "shield":
            return props.player.getModifiedValue('shieldWeight');
        }
    } else {
        return props.armor.weight.value;
    }

};

const getProtectionParade = () => {
    if (props.player) {
        switch (props.armor.identifier) {
        case "unknown":
            return '';
        case "armor":
            return props.player.getModifiedValue('armorProtection') + 'd';
        case "helm":
            return '+' + props.player.getModifiedValue('helmProtection') + 'd';
        case "shield":
            return '+' + props.player.getModifiedValue('shieldParade');
        }
    } else if (props.armor.identifier === 'unknown') {
        return '';
    } else {
        if (props.armor.identifier === 'shield') {
            return '+' + props.armor.parade.value;
        } else if (props.armor.identifier === 'armor') {
            return props.armor.protection.value + 'd';
        } else {
            return '+' + props.armor.protection.value + 'd';
        }
    }
};

const getName = () => {
    if (props.armor.identifier === 'unknown') {
        return '';
    } else {
        return props.armor.name;
    }
};

</script>

<style scoped></style>
