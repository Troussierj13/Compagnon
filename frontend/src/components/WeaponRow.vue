<template>
  <div class="flex w-full gap-1 grayscale font-sansserif font-bold text-[0.6rem] leading-[0.8rem]">
    <span class="grow line-bottom-sm h-[1.125rem] my-auto">{{
        props.weapon.name
      }}</span>
    <span
        class="w-1/12 line-bottom-sm text-center h-[1.125rem] my-auto">{{
        props.weapon.dmg
      }}</span>
    <span
        class="w-1/12 line-bottom-sm text-center h-[1.125rem] my-auto">{{
        props.weapon.injury
      }}</span>
    <span
        class="w-1/12 line-bottom-sm text-center h-[1.125rem] my-auto">{{
        props.weapon.weight
      }}</span>
    <span class="w-4/12 line-bottom-sm h-[1.125rem] my-auto">{{
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
                    "name": "",
                    "dmg": "",
                    "injury": "",
                    "weight": "",
                    "note": ""
                }
            },
        }
})
</script>

<style scoped>

</style>