<template>
    <div class="m-auto flex relative h-full justify-center items-center">
        <div class="flex justify-center">
            <div class="flex flex-col justify-center items-center space-y-6 rounded bg-one-ring h-64 aspect-[9/7]">
                <router-link to="/spectator">
                    <PrincipalButton content="Spectator"></PrincipalButton>
                </router-link>
                <router-link to="/legenskeeper">
                    <PrincipalButton content="Legend Keeper"></PrincipalButton>
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
