<template>
  <div class="flex w-full gap-1 grayscale font-sansserif font-bold text-[0.6rem] leading-[0.8rem]">
    <span class="grow line-bottom-sm h-[1.125rem]">{{ armor.name }}</span>
    <span class="w-1/5 line-bottom-sm text-center h-[1.125rem] my-auto">{{
        (armor.parade === 0 ? armor.protection : armor.parade)
      }}</span>
    <span class="w-1/5 line-bottom-sm text-center h-[1.125rem] my-auto">{{ armor.weight }}</span>
  </div>
</template>

<script>
export default {
    name: "ArmorRow",
    props: {
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
    },
}
</script>

<style scoped>

</style>