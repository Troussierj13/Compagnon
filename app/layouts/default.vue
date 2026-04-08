<script setup lang="ts">
import { useGameSystem, GameSystemKey } from '~/composables/useGameSystem'

const gs = useGameSystem()
provide(GameSystemKey, gs)

// Charger les données si on est sur une page /gm/system
const route = useRoute()
if (import.meta.client && route.path.startsWith('/gm/system')) {
  gs.fetchAll()
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-gray-100">
    <!-- Navigation back-office MJ -->
    <nav class="border-b border-gray-800 bg-gray-900 px-4 py-3">
      <div class="mx-auto flex max-w-screen-xl items-center justify-between">
        <NuxtLink to="/gm" class="flex items-center gap-2 text-lg font-semibold text-white">
          <span>Compagnon JdR</span>
        </NuxtLink>

        <div class="flex items-center gap-4">
          <NuxtLink to="/gm" class="text-sm text-gray-400 hover:text-white transition-colors">
            Campagnes
          </NuxtLink>
          <NuxtLink to="/gm/system" class="text-sm text-gray-400 hover:text-white transition-colors">
            Système
          </NuxtLink>
          <span class="text-sm text-gray-600 cursor-not-allowed" title="À venir — Phase 6">NFC</span>
        </div>
      </div>
    </nav>

    <!-- Contenu principal -->
    <main class="mx-auto max-w-screen-xl px-4 py-6">
      <slot />
    </main>
  </div>
</template>
