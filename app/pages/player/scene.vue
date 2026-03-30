<script setup lang="ts">
definePageMeta({ middleware: 'player-session' })

const {
  session,
  activeScene,
  sceneEntities,
  playerName,
  selectedCharacter,
  availableCharacters,
  restore,
  clearSession,
  subscribeToSessionUpdates,
} = usePlayerSession()

const showCharacterSheet = ref(false)
const restored = ref(false)
let unsubscribe: (() => void) | null = null

onMounted(async () => {
  // Restaurer la session depuis localStorage
  const ok = await restore()
  if (!ok) {
    await navigateTo('/player/join')
    return
  }
  restored.value = true
  unsubscribe = subscribeToSessionUpdates()
})

onUnmounted(() => { unsubscribe?.() })

async function leave() {
  clearSession()
  await navigateTo('/')
}

const enemies = computed(() =>
  sceneEntities.value.filter(e => e.type === 'enemy'),
)
const items = computed(() =>
  sceneEntities.value.filter(e => e.type === 'item'),
)
const npcs = computed(() =>
  sceneEntities.value.filter(e => e.type === 'npc'),
)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-950 text-gray-100">
    <!-- Barre de status -->
    <div class="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
      <div class="flex items-center gap-2 text-sm">
        <UIcon name="i-heroicons-user-circle" class="text-gray-400" />
        <span>{{ playerName }}</span>
        <span v-if="selectedCharacter" class="text-primary-400">— {{ selectedCharacter.name }}</span>
      </div>

      <div class="flex items-center gap-2">
        <UBadge
          v-if="session"
          :color="session.status === 'active' ? 'green' : 'yellow'"
          variant="soft"
          size="xs"
        >
          {{ session.status === 'active' ? 'Session active' : 'En attente...' }}
        </UBadge>

        <UButton
          v-if="selectedCharacter"
          size="xs"
          variant="soft"
          icon="i-heroicons-identification"
          @click="showCharacterSheet = true"
        >
          Feuille de perso
        </UButton>

        <UButton size="xs" variant="ghost" color="red" @click="leave">
          Quitter
        </UButton>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="flex-1 flex flex-col">
      <!-- Scène active -->
      <div v-if="activeScene" class="flex-1 flex flex-col">
        <div class="px-4 py-2 bg-gray-900/50 border-b border-gray-800 text-sm">
          <span class="text-gray-400">Scène active :</span>
          <span class="ml-2 font-medium">{{ activeScene.name }}</span>
          <p v-if="activeScene.description" class="text-gray-500 text-xs mt-0.5">
            {{ activeScene.description }}
          </p>
        </div>

        <!-- Battlemap -->
        <div class="relative flex-1 bg-gray-950 overflow-hidden min-h-64">
          <img
            v-if="activeScene.battlemap_url"
            :src="activeScene.battlemap_url"
            class="w-full h-full object-contain"
            alt="Battlemap"
          >
          <div v-else class="absolute inset-0 flex items-center justify-center text-gray-700">
            <div class="text-center">
              <UIcon name="i-heroicons-map" class="text-5xl mb-2" />
              <p>Le MJ n'a pas encore chargé de carte pour cette scène.</p>
            </div>
          </div>

          <!-- Tokens des entités sur la map -->
          <PlayerEntityToken
            v-for="entity in sceneEntities"
            :key="entity.id"
            :entity="entity"
          />
        </div>

        <!-- Panneau entités -->
        <div v-if="sceneEntities.length > 0" class="bg-gray-900 border-t border-gray-800 p-4">
          <div class="grid gap-4 sm:grid-cols-3">
            <!-- Ennemis -->
            <div v-if="enemies.length > 0">
              <p class="text-xs uppercase text-red-400 font-semibold mb-2">
                Ennemis ({{ enemies.length }})
              </p>
              <div class="space-y-1">
                <PlayerEnemyCard v-for="e in enemies" :key="e.id" :entity="e" />
              </div>
            </div>

            <!-- PNJ -->
            <div v-if="npcs.length > 0">
              <p class="text-xs uppercase text-blue-400 font-semibold mb-2">
                PNJ ({{ npcs.length }})
              </p>
              <div class="space-y-1">
                <PlayerEntityCard v-for="e in npcs" :key="e.id" :entity="e" />
              </div>
            </div>

            <!-- Objets -->
            <div v-if="items.length > 0">
              <p class="text-xs uppercase text-yellow-400 font-semibold mb-2">
                Objets ({{ items.length }})
              </p>
              <div class="space-y-1">
                <PlayerEntityCard v-for="e in items" :key="e.id" :entity="e" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- En attente de scène -->
      <div v-else class="flex-1 flex items-center justify-center text-gray-600">
        <div class="text-center">
          <UIcon name="i-heroicons-clock" class="text-5xl mb-3" />
          <p class="text-lg">En attente que le MJ lance une scène…</p>
          <p class="text-sm mt-1">La page se mettra à jour automatiquement.</p>
        </div>
      </div>
    </div>

    <!-- Feuille de perso en plein écran -->
    <USlideover v-model:open="showCharacterSheet" side="right" class="w-full max-w-3xl">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="font-bold text-lg">{{ selectedCharacter?.name }}</h2>
          <UButton variant="ghost" icon="i-heroicons-x-mark" @click="showCharacterSheet = false" />
        </div>
      </template>
      <PlayerCharacterSheet
        v-if="selectedCharacter"
        :character="selectedCharacter"
        class="p-4"
      />
    </USlideover>
  </div>
</template>
