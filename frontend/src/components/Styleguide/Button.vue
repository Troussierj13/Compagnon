<template>
    <span class="border-red border rounded text-2xs px-1 cursor-pointer">
        {{ props.content }}
    </span>
</template>

<script lang="ts" setup>
interface Props {
    content: string;
}

const props = defineProps<Props>();

</script>

<style scoped>

</style>