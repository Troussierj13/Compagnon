<script setup lang="ts">
import type { Campaign, GameSession } from '~/types/rpg'

definePageMeta({ middleware: 'gm' })

const route = useRoute()
const supabase = useSupabaseClient()
const campaignId = route.params.id as string

const campaign = ref<Campaign | null>(null)
const sessions = ref<GameSession[]>([])
const loading = ref(true)
const starting = ref(false)

const { characters, fetchAll: fetchCharacters, create: createCharacter, remove: removeCharacter } = useCharacter(campaignId)

const showNewCharacter = ref(false)
const newCharName = ref('')
const newPlayerName = ref('')
const showDeleteConfirm = ref(false)
const charToDelete = ref<string | null>(null)

async function fetchData() {
  const [{ data: campaignData }, { data: sessionsData }] = await Promise.all([
    supabase.from('campaigns').select('*').eq('id', campaignId).single(),
    supabase.from('sessions').select('*').eq('campaign_id', campaignId).order('created_at', { ascending: false }),
  ])
  campaign.value = campaignData as Campaign
  sessions.value = (sessionsData as GameSession[]) ?? []
  await fetchCharacters()
  loading.value = false
}

const { createSession } = useGMSession()

async function startSession() {
  starting.value = true
  const session = await createSession(campaignId)
  if (session) {
    await navigateTo(`/gm/campaigns/${campaignId}/session/${session.id}`)
  }
  starting.value = false
}

async function handleCreateCharacter() {
  await createCharacter(newCharName.value, newPlayerName.value)
  newCharName.value = ''
  newPlayerName.value = ''
  showNewCharacter.value = false
}

async function confirmDeleteCharacter() {
  if (!charToDelete.value) return
  await removeCharacter(charToDelete.value)
  charToDelete.value = null
  showDeleteConfirm.value = false
}

const activeSession = computed(() =>
  sessions.value.find(s => s.status === 'waiting' || s.status === 'active'),
)

onMounted(fetchData)
</script>

<template>
  <div class="min-h-screen p-6 max-w-5xl mx-auto">
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-2xl" />
    </div>

    <template v-else>
      <!-- Breadcrumb + header -->
      <div class="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <NuxtLink to="/gm" class="hover:text-white">Campagnes</NuxtLink>
        <UIcon name="i-heroicons-chevron-right" />
        <span class="text-white">{{ campaign?.name }}</span>
      </div>

      <div class="flex items-start justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold">{{ campaign?.name }}</h1>
          <p v-if="campaign?.description" class="text-gray-400 mt-1">{{ campaign.description }}</p>
        </div>

        <UButton
          v-if="activeSession"
          color="primary"
          icon="i-heroicons-play"
          :to="`/gm/campaigns/${campaignId}/session/${activeSession.id}`"
        >
          Reprendre la session
        </UButton>
        <UButton
          v-else
          color="primary"
          icon="i-heroicons-play"
          :loading="starting"
          @click="startSession"
        >
          Lancer une session
        </UButton>
      </div>

      <div class="grid gap-8 lg:grid-cols-2">
        <!-- Personnages -->
        <section>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">Personnages</h2>
            <UButton size="sm" icon="i-heroicons-plus" @click="showNewCharacter = true">
              Ajouter
            </UButton>
          </div>

          <UModal v-model:open="showNewCharacter" title="Nouveau personnage">
            <template #body>
              <div class="space-y-4">
                <UFormField label="Nom du personnage" required>
                  <UInput v-model="newCharName" placeholder="Gandalf le Gris" />
                </UFormField>
                <UFormField label="Nom du joueur">
                  <UInput v-model="newPlayerName" placeholder="Tolkien" />
                </UFormField>
              </div>
            </template>
            <template #footer>
              <div class="flex justify-end gap-2">
                <UButton variant="ghost" @click="showNewCharacter = false">Annuler</UButton>
                <UButton @click="handleCreateCharacter">Créer</UButton>
              </div>
            </template>
          </UModal>

          <div v-if="characters.length === 0" class="text-gray-500 text-sm py-4">
            Aucun personnage dans cette campagne.
          </div>

          <div class="space-y-2">
            <UCard
              v-for="char in characters"
              :key="char.id"
              class="flex items-center justify-between"
            >
              <div>
                <p class="font-medium">{{ char.name }}</p>
                <p v-if="char.player_name" class="text-sm text-gray-400">{{ char.player_name }}</p>
              </div>
              <div class="flex gap-2">
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-heroicons-pencil"
                  :to="`/gm/campaigns/${campaignId}/characters/${char.id}`"
                />
                <UButton
                  size="xs"
                  color="red"
                  variant="ghost"
                  icon="i-heroicons-trash"
                  @click="charToDelete = char.id; showDeleteConfirm = true"
                />
              </div>
            </UCard>
          </div>
        </section>

        <!-- Historique des sessions -->
        <section>
          <h2 class="text-lg font-semibold mb-4">Sessions passées</h2>
          <div v-if="sessions.filter(s => s.status === 'ended').length === 0" class="text-gray-500 text-sm py-4">
            Aucune session terminée.
          </div>
          <div class="space-y-2">
            <UCard
              v-for="s in sessions.filter(s => s.status === 'ended')"
              :key="s.id"
            >
              <div class="flex justify-between items-center">
                <p class="text-sm text-gray-400">
                  {{ new Date(s.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) }}
                </p>
                <UBadge color="neutral">Terminée</UBadge>
              </div>
            </UCard>
          </div>
        </section>
      </div>
    </template>

    <!-- Modal confirmation suppression personnage -->
    <UModal v-model:open="showDeleteConfirm" title="Supprimer le personnage ?">
      <template #body>
        <p class="text-gray-300">
          Cette action est irréversible. Le personnage et toutes ses données seront définitivement supprimés.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="showDeleteConfirm = false; charToDelete = null">Annuler</UButton>
          <UButton color="red" @click="confirmDeleteCharacter">Supprimer</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
