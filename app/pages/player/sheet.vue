<script setup lang="ts">
/**
 * Vue feuille de personnage en plein écran pour affichage sur un écran dédié.
 * Ex: le joueur ouvre cet onglet sur son téléphone ou une tablette.
 */
definePageMeta({ middleware: 'player-session', layout: 'fullscreen' })

const { selectedCharacter, playerName, restore } = usePlayerSession()

onMounted(async () => {
  const ok = await restore()
  if (!ok) await navigateTo('/player/join')
})
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-gray-100 overflow-auto">
    <div v-if="!selectedCharacter" class="flex items-center justify-center min-h-screen text-gray-600">
      <div class="text-center">
        <UIcon name="i-heroicons-identification" class="text-5xl mb-3" />
        <p>Aucun personnage sélectionné.</p>
        <UButton class="mt-4" to="/player/scene" variant="ghost">
          Retour à la scène
        </UButton>
      </div>
    </div>

    <div v-else class="p-4">
      <!-- Header compact -->
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-2xl font-bold">{{ selectedCharacter.name }}</h1>
          <p class="text-gray-400 text-sm">{{ playerName }}</p>
        </div>
        <UButton to="/player/scene" variant="ghost" size="sm" icon="i-heroicons-arrow-left">
          Retour
        </UButton>
      </div>

      <PlayerCharacterSheet :character="selectedCharacter" />
    </div>
  </div>
</template>
