<script setup lang="ts">
import type { Reward, ModifierParam } from '~/types/rpg'
import { GameSystemKey } from '~/composables/useGameSystem'

definePageMeta({
  layout: 'default',
})

const toast = useToast()

const VALID_TARGET_OPTIONS = [
  { value: 'armor', label: 'Armure' },
  { value: 'helm', label: 'Casque' },
  { value: 'shield', label: 'Bouclier' },
  { value: 'weapon', label: 'Arme (tout slot)' },
]

const gs = inject(GameSystemKey)!

if (import.meta.client && gs.rewards.length === 0) {
  await gs.fetchRewards()
}

// ── Modale ───────────────────────────────────────────────────────────────────
const showModal = ref(false)
const editingReward = ref<Reward | null>(null)
const saving = ref(false)

const form = reactive({
  identifier: '',
  name: '',
  description: '',
  valid_targets: [] as Array<'armor' | 'helm' | 'shield' | 'weapon'>,
  modifiers: [] as ModifierParam[],
})

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
    await gs.deleteReward(pendingDeleteId.value)
    toast.add({ title: 'Récompense supprimée', color: 'success' })
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

function openCreate() {
  editingReward.value = null
  form.identifier = ''
  form.name = ''
  form.description = ''
  form.valid_targets = []
  form.modifiers = []
  showModal.value = true
}

function openEdit(r: Reward) {
  editingReward.value = r
  form.identifier = r.identifier
  form.name = r.name
  form.description = r.description
  form.valid_targets = [...r.valid_targets]
  form.modifiers = JSON.parse(JSON.stringify(r.modifiers))
  showModal.value = true
}

async function handleSave() {
  saving.value = true
  try {
    if (editingReward.value) {
      await gs.updateReward(editingReward.value.id, {
        identifier: form.identifier.trim(),
        name: form.name.trim(),
        description: form.description,
        valid_targets: form.valid_targets,
        modifiers: form.modifiers,
      })
      toast.add({ title: 'Récompense modifiée', color: 'success' })
    }
    else {
      await gs.createReward({
        identifier: form.identifier.trim(),
        name: form.name.trim(),
        description: form.description,
        valid_targets: form.valid_targets,
        modifiers: form.modifiers,
      })
      toast.add({ title: 'Récompense créée', color: 'success' })
    }
    showModal.value = false
  }
  catch (err) {
    console.error(err)
    toast.add({ title: 'Erreur lors de la sauvegarde', color: 'error' })
  }
  finally {
    saving.value = false
  }
}

function targetLabel(target: string): string {
  return VALID_TARGET_OPTIONS.find(o => o.value === target)?.label ?? target
}

function toggleTarget(value: 'armor' | 'helm' | 'shield' | 'weapon') {
  const idx = form.valid_targets.indexOf(value)
  if (idx === -1) form.valid_targets.push(value)
  else form.valid_targets.splice(idx, 1)
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- En-tête -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Récompenses
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          Récompenses de Vaillance applicables à l'équipement
        </p>
      </div>
      <UButton icon="i-heroicons-plus" label="Nouvelle récompense" @click="openCreate" />
    </div>

    <!-- Navigation secondaire -->
    <div class="flex gap-2">
      <UButton variant="ghost" label="Cultures" :to="{ path: '/gm/system' }" />
      <UButton variant="ghost" label="Vertus ordinaires" :to="{ path: '/gm/system/virtues' }" />
      <UButton variant="soft" label="Récompenses" :to="{ path: '/gm/system/rewards' }" />
    </div>

    <!-- Chargement -->
    <div v-if="gs.loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-2xl text-gray-400" />
    </div>

    <!-- Erreur -->
    <UAlert v-else-if="gs.error" color="error" :description="gs.error" icon="i-heroicons-exclamation-triangle" />

    <!-- Liste des récompenses -->
    <div v-else class="space-y-3">
      <div v-if="!gs.rewards.length" class="py-12 text-center text-gray-400">
        <UIcon name="i-heroicons-trophy" class="text-4xl mb-3" />
        <p class="font-medium">
          Aucune récompense
        </p>
        <p class="text-sm mt-1">
          Ajoutez des récompenses de Vaillance pour votre campagne
        </p>
      </div>

      <UCard
        v-for="reward in gs.rewards"
        :key="reward.id"
        class="hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span class="font-semibold text-gray-900 dark:text-white">{{ reward.name }}</span>
              <UBadge variant="outline" size="sm">
                {{ reward.identifier }}
              </UBadge>
              <UBadge
                v-for="target in reward.valid_targets"
                :key="target"
                color="warning"
                variant="soft"
                size="sm"
              >
                {{ targetLabel(target) }}
              </UBadge>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ reward.description }}
            </p>
            <p v-if="reward.modifiers.length" class="text-xs text-gray-400 mt-1">
              {{ reward.modifiers.length }} modificateur{{ reward.modifiers.length > 1 ? 's' : '' }}
            </p>
          </div>
          <div class="flex gap-2 shrink-0">
            <UButton icon="i-heroicons-pencil-square" variant="ghost" size="sm" @click="openEdit(reward)" />
            <UButton icon="i-heroicons-trash" variant="ghost" color="error" size="sm" @click="openDeleteConfirm(reward.id, reward.name)" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Modale -->
    <UModal
      v-model:open="showModal"
      :title="editingReward ? 'Modifier la récompense' : 'Nouvelle récompense'"
    >
      <template #body>
        <div class="space-y-4">
          <UFormField label="Identifiant (slug)" name="identifier" required>
            <UInput v-model="form.identifier" placeholder="ex: devastating_reward" class="w-full" />
          </UFormField>
          <UFormField label="Nom" name="name" required>
            <UInput v-model="form.name" placeholder="Nom de la récompense" class="w-full" />
          </UFormField>
          <UFormField label="Description" name="description">
            <UTextarea v-model="form.description" rows="3" class="w-full" />
          </UFormField>

          <!-- Cibles valides -->
          <UFormField label="Applicable sur">
            <div class="flex flex-wrap gap-2 mt-1">
              <UCheckbox
                v-for="opt in VALID_TARGET_OPTIONS"
                :key="opt.value"
                :model-value="form.valid_targets.includes(opt.value as 'armor' | 'helm' | 'shield' | 'weapon')"
                :label="opt.label"
                @update:model-value="toggleTarget(opt.value as 'armor' | 'helm' | 'shield' | 'weapon')"
              />
            </div>
          </UFormField>

          <div class="flex justify-end gap-2 pt-2">
            <UButton variant="ghost" label="Annuler" @click="showModal = false" />
            <UButton
              label="Sauvegarder"
              :loading="saving"
              :disabled="!form.identifier.trim() || !form.name.trim()"
              @click="handleSave"
            />
          </div>
        </div>
      </template>
    </UModal>

    <!-- Modale confirmation suppression -->
    <UModal v-model:open="showDeleteConfirm">
      <template #content>
        <div class="p-4 space-y-4">
          <p>Supprimer <strong>{{ pendingDeleteName }}</strong> ?</p>
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
