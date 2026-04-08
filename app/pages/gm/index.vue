<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold">Tableau de bord</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Système de jeu -->
      <UCard
        as="a"
        href="/gm/system"
        class="hover:ring-2 hover:ring-primary cursor-pointer transition"
      >
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-cog-6-tooth" class="text-2xl text-primary" />
          <div>
            <div class="font-semibold text-lg">Système de jeu</div>
            <div class="text-sm text-gray-500">Cultures, vertus, récompenses</div>
          </div>
        </div>
      </UCard>

      <!-- Campagnes (à venir) -->
      <UCard class="opacity-50 cursor-not-allowed">
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-map" class="text-2xl text-gray-400" />
          <div>
            <div class="font-semibold text-lg text-gray-400">Campagnes</div>
            <div class="text-sm text-gray-400">À venir — Phase 2</div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
