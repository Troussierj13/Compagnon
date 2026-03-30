<script setup lang="ts">
import type { EntityType, EntityData, EnemyData } from '~/types/rpg'

definePageMeta({ middleware: 'gm' })

const route = useRoute()
const sessionId = route.params.sessionId as string
const campaignId = route.params.id as string

const {
  session,
  participants,
  loading: sessionLoading,
  error,
  loadSession,
  setActiveScene,
  endSession,
  subscribeToSession,
} = useGMSession()

const {
  scenes,
  entities,
  fetchScenes,
  createScene,
  fetchEntities,
  addEntity,
  updateEntity,
  removeEntity,
  uploadBattlemap,
  subscribeToEntities,
} = useScene(sessionId)

const showNewScene = ref(false)
const newSceneName = ref('')
const showEndConfirm = ref(false)
const activeSceneId = ref<string | null>(null)
const showAddEntity = ref(false)
const entityType = ref<EntityType>('enemy')
const entityName = ref('')
const entityEndurance = ref(10)
const entityVisible = ref(true)
const battlemapInput = ref<HTMLInputElement | null>(null)
const uploadingMap = ref(false)

let unsubSession: (() => void) | null = null
let unsubEntities: (() => void) | null = null

onMounted(async () => {
  await loadSession(sessionId)
  await fetchScenes()

  if (session.value?.active_scene_id) {
    activeSceneId.value = session.value.active_scene_id
    await fetchEntities(session.value.active_scene_id)
    unsubEntities = subscribeToEntities(session.value.active_scene_id)
  }

  unsubSession = subscribeToSession(sessionId)
})

onUnmounted(() => {
  unsubSession?.()
  unsubEntities?.()
})

const activeScene = computed(() =>
  scenes.value.find(s => s.id === activeSceneId.value) ?? null,
)

async function handleSetScene(sceneId: string | null) {
  unsubEntities?.()
  await setActiveScene(sceneId)
  activeSceneId.value = sceneId

  if (sceneId) {
    await fetchEntities(sceneId)
    unsubEntities = subscribeToEntities(sceneId)
  }
}

async function handleCreateScene() {
  const scene = await createScene(newSceneName.value)
  if (scene) {
    newSceneName.value = ''
    showNewScene.value = false
    await handleSetScene(scene.id)
  }
}

async function handleUploadBattlemap(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || !activeSceneId.value) return
  uploadingMap.value = true
  await uploadBattlemap(activeSceneId.value, file)
  uploadingMap.value = false
}

async function handleAddEntity() {
  if (!activeSceneId.value || !entityName.value.trim()) return

  const data: EntityData = entityType.value === 'enemy'
    ? { endurance: entityEndurance.value, endurance_max: entityEndurance.value, parry: 14, armor: 0 } as EnemyData
    : { description: '' }

  await addEntity(activeSceneId.value, entityType.value, entityName.value.trim(), data, { x: 0, y: 0 }, entityVisible.value)
  entityName.value = ''
  entityEndurance.value = 10
  showAddEntity.value = false
}

async function handleEndSession() {
  await endSession()
  showEndConfirm.value = false
  navigateTo(`/gm/campaigns/${campaignId}`)
}

const visibleEntities = computed(() => entities.value.filter(e => e.visible_to_players))
const hiddenEntities = computed(() => entities.value.filter(e => !e.visible_to_players))
</script>

<template>
  <div class="min-h-screen p-4 flex flex-col gap-4">
    <!-- Debug erreur -->
    <div v-if="error" class="bg-red-900 text-red-200 text-sm p-3 rounded">
      Erreur : {{ error }}
    </div>

    <!-- Header session -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <NuxtLink :to="`/gm/campaigns/${campaignId}`" class="text-gray-400 hover:text-white">
          <UIcon name="i-heroicons-arrow-left" />
        </NuxtLink>
        <div>
          <h1 class="font-bold text-lg">Session en cours</h1>
          <div class="flex items-center gap-2 text-sm flex-wrap">
            <span class="text-gray-400">Code joueurs :</span>
            <UBadge color="primary" variant="solid" class="font-mono text-base tracking-widest">
              {{ session?.join_code }}
            </UBadge>
            <span class="text-gray-500 hidden sm:inline">—</span>
            <NuxtLink
              :to="`/display/${sessionId}`"
              target="_blank"
              class="text-gray-500 hover:text-gray-300 flex items-center gap-1 text-xs"
            >
              <UIcon name="i-heroicons-tv" />
              Affichage TV
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="flex gap-2">
        <UBadge
          :color="session?.status === 'active' ? 'green' : 'yellow'"
          class="capitalize"
        >
          {{ session?.status === 'active' ? 'En cours' : 'En attente' }}
        </UBadge>
        <UButton color="red" variant="soft" size="sm" @click="showEndConfirm = true">
          Terminer
        </UButton>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-3 flex-1">
      <!-- Colonne gauche : scènes + participants -->
      <div class="space-y-4">
        <!-- Scènes -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="font-semibold">Scènes</h2>
              <UButton size="xs" icon="i-heroicons-plus" @click="showNewScene = true" />
            </div>
          </template>

          <div class="space-y-1">
            <button
              v-for="scene in scenes"
              :key="scene.id"
              class="w-full text-left px-3 py-2 rounded-lg text-sm transition"
              :class="activeSceneId === scene.id
                ? 'bg-primary-600 text-white'
                : 'hover:bg-gray-800 text-gray-300'"
              @click="handleSetScene(scene.id)"
            >
              <div class="flex items-center justify-between">
                <span class="truncate">{{ scene.name }}</span>
                <UIcon
                  v-if="activeSceneId === scene.id"
                  name="i-heroicons-eye"
                  class="shrink-0 ml-1"
                />
              </div>
            </button>

            <p v-if="scenes.length === 0" class="text-gray-500 text-sm py-2">
              Aucune scène. Créez-en une pour commencer.
            </p>
          </div>
        </UCard>

        <!-- Participants -->
        <UCard>
          <template #header>
            <h2 class="font-semibold">
              Joueurs connectés
              <UBadge class="ml-2" color="neutral" variant="soft">{{ participants.length }}</UBadge>
            </h2>
          </template>
          <div v-if="participants.length === 0" class="text-gray-500 text-sm py-2">
            En attente de joueurs...
          </div>
          <div class="space-y-2">
            <div
              v-for="p in participants"
              :key="p.id"
              class="flex items-center gap-2 text-sm"
            >
              <UIcon name="i-heroicons-user-circle" class="text-gray-400" />
              <span>{{ p.player_name }}</span>
              <span v-if="p.character" class="text-gray-500">— {{ p.character.name }}</span>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Colonne centrale : battlemap -->
      <div class="lg:col-span-2">
        <UCard class="h-full flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="font-semibold">
                {{ activeScene?.name ?? 'Aucune scène active' }}
              </h2>
              <div v-if="activeScene" class="flex gap-2">
                <UButton
                  size="xs"
                  variant="soft"
                  icon="i-heroicons-photo"
                  :loading="uploadingMap"
                  @click="battlemapInput?.click()"
                >
                  Battlemap
                </UButton>
                <input
                  ref="battlemapInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleUploadBattlemap"
                >
                <UButton
                  size="xs"
                  icon="i-heroicons-plus"
                  @click="showAddEntity = true"
                >
                  Ajouter entité
                </UButton>
              </div>
            </div>
          </template>

          <div class="flex-1 relative min-h-64 bg-gray-900 rounded-lg overflow-hidden">
            <!-- Battlemap image -->
            <img
              v-if="activeScene?.battlemap_url"
              :src="activeScene.battlemap_url"
              class="w-full h-full object-contain"
              alt="Battlemap"
            >
            <div v-else-if="activeScene" class="absolute inset-0 flex items-center justify-center text-gray-600">
              <div class="text-center">
                <UIcon name="i-heroicons-map" class="text-4xl mb-2" />
                <p class="text-sm">Aucune battlemap. Importez une image.</p>
              </div>
            </div>
            <div v-else class="absolute inset-0 flex items-center justify-center text-gray-600">
              <p class="text-sm">Sélectionnez ou créez une scène à gauche.</p>
            </div>

            <!-- Tokens des entités visibles (positionnement simplifié) -->
            <GMEntityToken
              v-for="entity in entities"
              :key="entity.id"
              :entity="entity"
              @update="updateEntity(entity.id, $event)"
              @remove="removeEntity(entity.id)"
            />
          </div>

          <!-- Liste des entités -->
          <div v-if="activeScene && entities.length > 0" class="mt-3 space-y-1">
            <p class="text-xs text-gray-500 uppercase tracking-wide">Entités</p>
            <div class="flex flex-wrap gap-2">
              <GMEntityBadge
                v-for="entity in entities"
                :key="entity.id"
                :entity="entity"
                @toggle-visibility="updateEntity(entity.id, { visible_to_players: !entity.visible_to_players })"
                @remove="removeEntity(entity.id)"
              />
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Modal nouvelle scène -->
    <UModal v-model:open="showNewScene" title="Nouvelle scène">
      <template #body>
        <UFormField label="Nom de la scène" required>
          <UInput v-model="newSceneName" placeholder="La Taverne du Poney Fringant..." />
        </UFormField>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="showNewScene = false">Annuler</UButton>
          <UButton @click="handleCreateScene">Créer</UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal ajouter entité -->
    <UModal v-model:open="showAddEntity" title="Ajouter une entité">
      <template #body>
        <div class="space-y-4">
          <UFormField label="Type">
            <USelect
              v-model="entityType"
              :options="[
                { label: 'Ennemi', value: 'enemy' },
                { label: 'PNJ', value: 'npc' },
                { label: 'Objet', value: 'item' },
                { label: 'Zone', value: 'zone' },
              ]"
            />
          </UFormField>
          <UFormField label="Nom" required>
            <UInput v-model="entityName" placeholder="Gobelin, Épée de Lumière..." />
          </UFormField>
          <UFormField v-if="entityType === 'enemy'" label="Endurance">
            <UInput v-model.number="entityEndurance" type="number" min="1" />
          </UFormField>
          <UFormField label="Visible par les joueurs">
            <UToggle v-model="entityVisible" />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="showAddEntity = false">Annuler</UButton>
          <UButton @click="handleAddEntity">Ajouter</UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal confirmation fin de session -->
    <UModal v-model:open="showEndConfirm" title="Terminer la session ?">
      <template #body>
        <p class="text-gray-300">
          La session sera marquée comme terminée. Les joueurs ne pourront plus la rejoindre.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="showEndConfirm = false">Annuler</UButton>
          <UButton color="red" @click="handleEndSession">Terminer la session</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
