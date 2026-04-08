<script setup lang="ts">
import { GameSystemKey } from '~/composables/useGameSystem'

definePageMeta({
  layout: 'default',
})

const gs = inject(GameSystemKey)!
const toast = useToast()

await gs.fetchAll()

// ── Modale création culture ──────────────────────────────────────────────────
const showCreateModal = ref(false)
const creating = ref(false)
const form = reactive({
  name: '',
  description: '',
})

async function handleCreate() {
  if (!form.name.trim()) return
  creating.value = true
  try {
    const culture = await gs.createCulture({
      name: form.name.trim(),
      description: form.description.trim() || null,
      starting_attributes: [],
      endurance_bonus: 0,
      hope_bonus: 0,
      parade_bonus: 0,
      starting_favored_skills: [],
      starting_combat_skills: {},
    })
    toast.add({ title: 'Culture créée', color: 'success' })
    showCreateModal.value = false
    form.name = ''
    form.description = ''
    await navigateTo(`/gm/system/cultures/${culture.id}`)
  }
  catch (err) {
    console.error(err)
    toast.add({ title: 'Erreur lors de la création', color: 'error' })
  }
  finally {
    creating.value = false
  }
}

// ── Modale confirmation suppression ─────────────────────────────────────────
const showDeleteConfirm = ref(false)
const pendingDeleteId = ref<string>('')
const pendingDeleteName = ref<string>('')
const deleting = ref(false)

function openDeleteConfirm(id: string, name: string) {
  pendingDeleteId.value = id
  pendingDeleteName.value = name
  showDeleteConfirm.value = true
}

async function confirmDelete() {
  deleting.value = true
  try {
    await gs.deleteCulture(pendingDeleteId.value)
    toast.add({ title: 'Culture supprimée', color: 'success' })
    showDeleteConfirm.value = false
  }
  catch (err) {
    console.error(err)
    toast.add({ title: 'Erreur lors de la suppression', color: 'error' })
  }
  finally {
    deleting.value = false
  }
}

const columns = [
  { key: 'name', label: 'Nom' },
  { key: 'endurance_bonus', label: 'Endurance +' },
  { key: 'hope_bonus', label: 'Espoir +' },
  { key: 'parade_bonus', label: 'Parade +' },
  { key: 'virtues_count', label: 'Vertus culturelles' },
  { key: 'actions', label: '' },
]

const rows = computed(() =>
  gs.cultures.map(c => ({
    ...c,
    virtues_count: c.cultural_virtues.length,
  })),
)
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- En-tête -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Système de jeu
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          Cultures, vertus ordinaires et récompenses
        </p>
      </div>
      <UButton
        icon="i-heroicons-plus"
        label="Nouvelle culture"
        @click="showCreateModal = true"
      />
    </div>

    <!-- Navigation secondaire -->
    <div class="flex gap-2">
      <UButton
        variant="soft"
        label="Cultures"
        :to="{ path: '/gm/system' }"
      />
      <UButton
        variant="ghost"
        label="Vertus ordinaires"
        :to="{ path: '/gm/system/virtues' }"
      />
      <UButton
        variant="ghost"
        label="Récompenses"
        :to="{ path: '/gm/system/rewards' }"
      />
    </div>

    <!-- État de chargement -->
    <div v-if="gs.loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-2xl text-gray-400" />
    </div>

    <!-- Erreur -->
    <UAlert
      v-else-if="gs.error"
      color="error"
      :description="gs.error"
      icon="i-heroicons-exclamation-triangle"
    />

    <!-- Table des cultures -->
    <UTable
      v-else
      :columns="columns"
      :rows="rows"
      :empty-state="{ icon: 'i-heroicons-globe-alt', label: 'Aucune culture', description: 'Créez votre première culture pour commencer.' }"
    >
      <template #name-data="{ row }">
        <NuxtLink
          :to="`/gm/system/cultures/${row.id}`"
          class="font-medium text-primary-600 hover:underline"
        >
          {{ row.name }}
        </NuxtLink>
      </template>

      <template #endurance_bonus-data="{ row }">
        <UBadge variant="soft" color="success">
          +{{ row.endurance_bonus }}
        </UBadge>
      </template>

      <template #hope_bonus-data="{ row }">
        <UBadge variant="soft" color="info">
          +{{ row.hope_bonus }}
        </UBadge>
      </template>

      <template #virtues_count-data="{ row }">
        <UBadge variant="outline">
          {{ row.virtues_count }}
        </UBadge>
      </template>

      <template #actions-data="{ row }">
        <div class="flex gap-2 justify-end">
          <UButton
            icon="i-heroicons-pencil-square"
            variant="ghost"
            size="sm"
            :to="`/gm/system/cultures/${row.id}`"
          />
          <UButton
            icon="i-heroicons-trash"
            variant="ghost"
            color="error"
            size="sm"
            @click="openDeleteConfirm(row.id, row.name)"
          />
        </div>
      </template>
    </UTable>

    <!-- Modale création -->
    <UModal v-model:open="showCreateModal" title="Nouvelle culture">
      <template #body>
        <UForm :state="form" class="space-y-4" @submit="handleCreate">
          <UFormField label="Nom" name="name" required>
            <UInput v-model="form.name" placeholder="Ex: Hobbits de la Comté" class="w-full" />
          </UFormField>
          <UFormField label="Description" name="description">
            <UTextarea v-model="form.description" placeholder="Description de la culture..." rows="3" class="w-full" />
          </UFormField>
          <div class="flex justify-end gap-2 pt-2">
            <UButton variant="ghost" label="Annuler" @click="showCreateModal = false" />
            <UButton
              type="submit"
              label="Créer"
              :loading="creating"
              :disabled="!form.name.trim()"
            />
          </div>
        </UForm>
      </template>
    </UModal>

    <!-- Modale confirmation suppression -->
    <UModal v-model:open="showDeleteConfirm">
      <template #content>
        <div class="p-4 space-y-4">
          <p>Supprimer la culture <strong>{{ pendingDeleteName }}</strong> ? Cette action est irréversible.</p>
          <div class="flex gap-2 justify-end">
            <UButton variant="ghost" @click="showDeleteConfirm = false">
              Annuler
            </UButton>
            <UButton color="error" :loading="deleting" @click="confirmDelete">
              Supprimer
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
