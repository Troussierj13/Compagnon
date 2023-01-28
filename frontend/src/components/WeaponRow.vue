<template>
  <div class="flex w-full gap-1 grayscale font-sansserif font-bold text-[0.6rem] leading-[0.8rem]">
    <span class="grow line-bottom-sm h-[1.125rem] my-auto">{{
        weapon.name
      }}</span>
    <span
        class="w-1/12 line-bottom-sm text-center h-[1.125rem] my-auto">{{
        weapon.dmg
      }}</span>
    <span
        class="w-1/12 line-bottom-sm text-center h-[1.125rem] my-auto">{{
        weapon.injury
      }}</span>
    <span
        class="w-1/12 line-bottom-sm text-center h-[1.125rem] my-auto">{{
        weapon.weight
      }}</span>
    <span class="w-4/12 line-bottom-sm h-[1.125rem] my-auto">{{
        weapon.note
      }}</span>
  </div>
</template>

<script>

export default {
    name: "WeaponRow",
    props: {
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
        },
    },
}
</script>

<style scoped>

</style>