<template>
    <div class="relative flex flex-col rounded p-4 bg-one-ring bg-top h-[30%] aspect-[9/7]">
        <div class="flex flex-col">
            <span>Partie en cours</span>
            <div class="flex flex-col mt-4">
                <div
                    v-for="el in ['game1', 'game2', 'game3'].slice(0, 3)"
                    class="flex">
                    <span>{{ el }}</span>
                </div>
            </div>
        </div>
        <button class="absolute top-5 right-4 rounded px-2 text-xs border border-red">Creer un partie</button>
    </div>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.bg-one-ring {
    @apply bg-sheet bg-cover bg-clip-border bg-top bg-origin-border
}
</style>