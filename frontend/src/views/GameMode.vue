<template>
    <div class="m-auto flex relative h-full justify-center items-center">
        <div class="flex justify-center">
            <div class="flex flex-col justify-center pt-6 items-center gap-6 rounded bg-one-ring h-64 aspect-[9/7]">
                <router-link to="/spectator">
                    <PrincipalButton content="Spectator" class="w-48 text-sm"></PrincipalButton>
                </router-link>
                <router-link to="/legenskeeper">
                    <PrincipalButton content="Legend Keeper" class="w-48 text-sm"></PrincipalButton>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import PrincipalButton from "../components/Styleguide/PrincipalButton.vue";
</script>

<style scoped>
.bg-one-ring {
    @apply bg-cardLayoutFront bg-cover bg-clip-border bg-top bg-origin-border
}
</style>
