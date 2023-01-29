<template>
  <div class="flex w-full gap-1 grayscale font-sansserif font-bold text-[0.6rem] leading-[0.8rem]">
    <span class="grow line-bottom-sm h-[1.125rem]">{{ props.armor.name }}</span>
    <span class="w-1/5 line-bottom-sm text-center h-[1.125rem] my-auto">{{
        (props.armor.parade === 0 ? props.armor.protection : props.armor.parade)
      }}</span>
    <span class="w-1/5 line-bottom-sm text-center h-[1.125rem] my-auto">{{ props.armor.weight }}</span>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
   armor: {
            type: Object,
            default() {
                return {
                    "name": "",
                    "protection": "",
                    "parade": "",
                    "weight": ""
                }
            },
        },
})
</script>

<style scoped>

</style>