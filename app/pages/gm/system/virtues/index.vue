<script setup lang="ts">
import type { Virtue, VirtueVariant } from '~/types/rpg'
import { GameSystemKey } from '~/composables/useGameSystem'

definePageMeta({
  layout: 'default',
})

const toast = useToast()
const gs = inject(GameSystemKey)!

if (import.meta.client && gs.virtues.length === 0) {
  await gs.fetchVirtues()
}

// ── Modale ───────────────────────────────────────────────────────────────────
const showModal = ref(false)
const editingVirtue = ref<Virtue | null>(null)
const saving = ref(false)
const form = reactive({
  identifier: '',
  name: '',
  description: '',
  variants: [] as VirtueVariant[],
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
    await gs.deleteVirtue(pendingDeleteId.value)
    toast.add({ title: 'Vertu supprimée', color: 'success' })
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
  editingVirtue.value = null
  form.identifier = ''
  form.name = ''
  form.description = ''
  form.variants = []
  showModal.value = true
}

function openEdit(v: Virtue) {
  editingVirtue.value = v
  form.identifier = v.identifier
  form.name = v.name
  form.description = v.description
  form.variants = JSON.parse(JSON.stringify(v.variants))
  showModal.value = true
}

async function handleSave() {
  saving.value = true
  try {
    if (editingVirtue.value) {
      await gs.updateVirtue(editingVirtue.value.id, {
        identifier: form.identifier.trim(),
        name: form.name.trim(),
        description: form.description,
        variants: form.variants,
      })
      toast.add({ title: 'Vertu modifiée', color: 'success' })
    }
    else {
      await gs.createVirtue({
        identifier: form.identifier.trim(),
        name: form.name.trim(),
        description: form.description,
        variants: form.variants,
      })
      toast.add({ title: 'Vertu créée', color: 'success' })
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

function addVariant() {
  form.variants.push({ name: '', description: '', modifiers: [] })
}

function removeVariant(index: number) {
  form.variants.splice(index, 1)
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- En-tête -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Vertus ordinaires
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          Vertus accessibles à toutes les cultures (Sagesse)
        </p>
      </div>
      <UButton icon="i-heroicons-plus" label="Nouvelle vertu" @click="openCreate" />
    </div>

    <!-- Navigation secondaire -->
    <div class="flex gap-2">
      <UButton variant="ghost" label="Cultures" :to="{ path: '/gm/system' }" />
      <UButton variant="soft" label="Vertus ordinaires" :to="{ path: '/gm/system/virtues' }" />
      <UButton variant="ghost" label="Récompenses" :to="{ path: '/gm/system/rewards' }" />
    </div>

    <!-- Chargement -->
    <div v-if="gs.loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-2xl text-gray-400" />
    </div>

    <!-- Erreur -->
    <UAlert v-else-if="gs.error" color="error" :description="gs.error" icon="i-heroicons-exclamation-triangle" />

    <!-- Liste des vertus -->
    <div v-else class="space-y-3">
      <div v-if="!gs.virtues.length" class="py-12 text-center text-gray-400">
        <UIcon name="i-heroicons-sparkles" class="text-4xl mb-3" />
        <p class="font-medium">
          Aucune vertu ordinaire
        </p>
        <p class="text-sm mt-1">
          Ajoutez des vertus disponibles pour tous les personnages
        </p>
      </div>

      <UCard
        v-for="virtue in gs.virtues"
        :key="virtue.id"
        class="hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-semibold text-gray-900 dark:text-white">{{ virtue.name }}</span>
              <UBadge variant="outline" size="sm">
                {{ virtue.identifier }}
              </UBadge>
              <UBadge v-if="virtue.variants.length" color="info" variant="soft" size="sm">
                {{ virtue.variants.length }} variante{{ virtue.variants.length > 1 ? 's' : '' }}
              </UBadge>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ virtue.description }}
            </p>
          </div>
          <div class="flex gap-2 shrink-0">
            <UButton icon="i-heroicons-pencil-square" variant="ghost" size="sm" @click="openEdit(virtue)" />
            <UButton icon="i-heroicons-trash" variant="ghost" color="error" size="sm" @click="openDeleteConfirm(virtue.id, virtue.name)" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Modale -->
    <UModal
      v-model:open="showModal"
      :title="editingVirtue ? 'Modifier la vertu' : 'Nouvelle vertu ordinaire'"
    >
      <template #body>
        <div class="space-y-4">
          <UFormField label="Identifiant (slug)" name="identifier" required>
            <UInput v-model="form.identifier" placeholder="ex: empowered_virtue" class="w-full" />
          </UFormField>
          <UFormField label="Nom" name="name" required>
            <UInput v-model="form.name" placeholder="Nom de la vertu" class="w-full" />
          </UFormField>
          <UFormField label="Description" name="description">
            <UTextarea v-model="form.description" rows="3" class="w-full" />
          </UFormField>

          <!-- Variantes -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Variantes</span>
              <UButton icon="i-heroicons-plus" size="xs" variant="ghost" label="Ajouter" @click="addVariant" />
            </div>
            <div
              v-for="(variant, idx) in form.variants"
              :key="idx"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-medium text-gray-500">Variante {{ idx + 1 }}</span>
                <UButton icon="i-heroicons-x-mark" size="xs" variant="ghost" color="error" @click="removeVariant(idx)" />
              </div>
              <UInput v-model="variant.name" placeholder="Nom de la variante" class="w-full" />
              <UTextarea v-model="variant.description" placeholder="Description" rows="2" class="w-full" />
            </div>
          </div>

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
