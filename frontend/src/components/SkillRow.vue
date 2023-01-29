<template>
  <div class="flex">
    <span v-if="props.favorisable"
          class="square mr-2 flex relative">
      <span v-if="skill.favored"
            class="absolute bg-check w-3 h-3 bg-cover bg-center bg-no-repeat rotate-45"></span>
    </span>
    <span
        class="grow h-[1.375rem] mr-2 line-bottom-sm relative text-[0.8rem] leading-[rem] font-serif font-bold">{{
        props.skill.name
      }}</span>
    <span class="square mx-1.5 rotate-45">
      <span v-if="props.skill.rank >= 1"
            class="absolute bg-check w-3 h-3 bg-cover bg-center bg-no-repeat"></span>
    </span>
    <span class="square mx-1.5 rotate-45">
      <span v-if="props.skill.rank >= 2"
            class="absolute bg-check w-3 h-3 bg-cover bg-center bg-no-repeat"></span>
    </span>
    <span class="square mx-1.5 rotate-45">
      <span v-if="props.skill.rank >= 3"
            class="absolute bg-check w-3 h-3 bg-cover bg-center bg-no-repeat"></span>
    </span>
    <span class="square mx-1.5 rotate-45">
      <span v-if="props.skill.rank >= 4"
            class="absolute bg-check w-3 h-3 bg-cover bg-center bg-no-repeat"></span>
    </span>
    <span class="square mx-1.5 rotate-45">
      <span v-if="props.skill.rank >= 5"
            class="absolute bg-check w-3 h-3 bg-cover bg-center bg-no-repeat"></span>
    </span>
    <span class="square mx-1.5 rotate-45">
      <span v-if="props.skill.rank >= 6"
            class="absolute bg-check w-3 h-3 bg-cover bg-center bg-no-repeat"></span>
    </span>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  "favorisable": Boolean,
  skill: {
    type: Object,
    default() {
      return {
        "name": "",
        "favored": false,
        "rank": 0
      }
    },
  }
})

</script>

<style scoped>

</style>