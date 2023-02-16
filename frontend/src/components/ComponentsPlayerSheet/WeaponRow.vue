<template>
    <div
        class="flex w-full gap-1 font-sansserif text-[0.6rem] font-bold leading-[0.8rem] grayscale"
    >
        <span class="line-bottom-sm my-auto h-[1.125rem] grow">{{
            props.weapon.name +
                (props.weapon?.rewardsMod.length > 0
                    ? ' ( ' + props.weapon?.rewardsMod.join(', ') + ' )'
                    : '')
        }}</span>
        <span class="line-bottom-sm my-auto h-[1.125rem] w-1/12 text-center">{{
            props.weapon.dmg
        }}</span>
        <span class="line-bottom-sm my-auto h-[1.125rem] w-1/12 text-center">{{
            props.weapon.injury.oneHand === props.weapon.injury.twoHand
                ? props.weapon.injury.oneHand
                : props.weapon.injury.oneHand +
                    ' / ' +
                    props.weapon.injury.twoHand
        }}</span>
        <span class="line-bottom-sm my-auto h-[1.125rem] w-1/12 text-center">{{
            props.weapon.weight
        }}</span>
        <span class="line-bottom-sm my-auto h-[1.125rem] w-4/12">{{
            props.weapon.note
        }}</span>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    weapon: {
        type: Object,
        default() {
            return {
                name: '',
                dmg: null,
                injury: {
                    oneHand: null,
                    twoHand: null,
                },
                weight: null,
                note: '',
                rewardsMod: [],
            };
        },
    },
});
</script>

<style scoped></style>
