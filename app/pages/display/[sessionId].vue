<script setup lang="ts">
definePageMeta({ layout: 'display' })

const route = useRoute()
const sessionId = route.params.sessionId as string

const { session, activeScene, sceneEntities, loading, error, loadState, subscribe } = useDisplaySession()

let unsubscribe: (() => void) | null = null

onMounted(async () => {
  const ok = await loadState(sessionId)
  if (ok) {
    unsubscribe = subscribe(sessionId)
  }
})

onUnmounted(() => { unsubscribe?.() })
</script>

<template>
  <div class="w-full h-full flex items-center justify-center">

    <!-- Erreur de chargement -->
    <div v-if="error" class="text-gray-600 text-center">
      <p class="text-2xl mb-2">Session introuvable</p>
      <p class="text-sm font-mono text-gray-700">{{ sessionId }}</p>
    </div>

    <!-- Chargement initial -->
    <div v-else-if="loading" class="text-gray-700 text-lg">
      Chargement…
    </div>

    <!-- Session terminée -->
    <div v-else-if="session?.status === 'ended'" class="text-gray-700 text-center">
      <p class="text-3xl font-bold mb-2">Session terminée</p>
    </div>

    <!-- En attente d'une scène -->
    <div v-else-if="!activeScene" class="text-center text-gray-800 select-none">
      <p class="text-4xl font-bold tracking-wide">{{ session?.campaign?.name }}</p>
      <p class="mt-4 text-gray-700 text-lg">En attente du MJ…</p>
    </div>

    <!-- Scène active -->
    <div v-else class="w-full h-full relative">

      <!-- Battlemap -->
      <img
        v-if="activeScene.battlemap_url"
        :src="activeScene.battlemap_url"
        class="w-full h-full object-contain"
        alt="Battlemap"
      >
      <div v-else class="w-full h-full flex items-center justify-center">
        <p class="text-gray-800 text-xl">{{ activeScene.name }}</p>
      </div>

      <!-- Tokens des entités visibles -->
      <PlayerEntityToken
        v-for="entity in sceneEntities"
        :key="entity.id"
        :entity="entity"
      />

      <!-- Nom de la scène (coin bas gauche) -->
      <div class="absolute bottom-4 left-4 text-white/40 text-sm select-none pointer-events-none">
        {{ activeScene.name }}
      </div>
    </div>

  </div>
</template>
