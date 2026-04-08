<script setup lang="ts">
import type { VirtueVariant } from '~/types/rpg'
import { GameSystemKey } from '~/composables/useGameSystem'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const toast = useToast()
const id = route.params.id as string

const gs = inject(GameSystemKey)!

// ── Données de la culture ────────────────────────────────────────────────────
interface CultureDetail {
  id: string
  name: string
  description: string | null
  endurance_bonus: number
  hope_bonus: number
  parade_bonus: number
  starting_favored_skills: string[]
  starting_combat_skills: Record<string, number>
  cultural_virtues: Array<{
    id: string
    identifier: string
    name: string
    description: string
    variants: VirtueVariant[]
  }>
}

const { data: culture, refresh } = await useFetch<CultureDetail>(`/api/game-system/cultures/${id}`)

if (!culture.value) {
  throw createError({ statusCode: 404, message: 'Culture introuvable' })
}

// ── Édition culture ──────────────────────────────────────────────────────────
const editForm = reactive({
  name: culture.value.name,
  description: culture.value.description ?? '',
  endurance_bonus: culture.value.endurance_bonus,
  hope_bonus: culture.value.hope_bonus,
  parade_bonus: culture.value.parade_bonus,
})
const saving = ref(false)

async function handleSave() {
  saving.value = true
  try {
    await gs.updateCulture(id, {
      name: editForm.name.trim(),
      description: editForm.description.trim() || null,
      endurance_bonus: editForm.endurance_bonus,
      hope_bonus: editForm.hope_bonus,
      parade_bonus: editForm.parade_bonus,
    })
    await refresh()
    toast.add({ title: 'Culture sauvegardée', color: 'success' })
  }
  catch (err) {
    console.error(err)
    toast.add({ title: 'Erreur lors de la sauvegarde', color: 'error' })
  }
  finally {
    saving.value = false
  }
}

// ── Vertus culturelles ───────────────────────────────────────────────────────
const showVirtueModal = ref(false)
const editingVirtue = ref<CultureDetail['cultural_virtues'][number] | null>(null)
const virtueForm = reactive({
  identifier: '',
  name: '',
  description: '',
  variants: [] as VirtueVariant[],
})
const savingVirtue = ref(false)

// ── Modale confirmation suppression ─────────────────────────────────────────
const showDeleteConfirm = ref(false)
const pendingDeleteId = ref<string>('')
const pendingDeleteName = ref<string>('')
const deleting = ref(false)

function openDeleteConfirm(virtueId: string, virtueName: string) {
  pendingDeleteId.value = virtueId
  pendingDeleteName.value = virtueName
  showDeleteConfirm.value = true
}

async function confirmDelete() {
  deleting.value = true
  try {
    await gs.deleteCulturalVirtue(pendingDeleteId.value, id)
    await refresh()
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

function openCreateVirtue() {
  editingVirtue.value = null
  virtueForm.identifier = ''
  virtueForm.name = ''
  virtueForm.description = ''
  virtueForm.variants = []
  showVirtueModal.value = true
}

function openEditVirtue(v: CultureDetail['cultural_virtues'][number]) {
  editingVirtue.value = v
  virtueForm.identifier = v.identifier
  virtueForm.name = v.name
  virtueForm.description = v.description
  virtueForm.variants = JSON.parse(JSON.stringify(v.variants))
  showVirtueModal.value = true
}

async function handleSaveVirtue() {
  savingVirtue.value = true
  try {
    if (editingVirtue.value) {
      await gs.updateCulturalVirtue(editingVirtue.value.id, {
        identifier: virtueForm.identifier.trim(),
        name: virtueForm.name.trim(),
        description: virtueForm.description,
        variants: virtueForm.variants,
      })
      toast.add({ title: 'Vertu modifiée', color: 'success' })
    }
    else {
      await gs.createCulturalVirtue(id, {
        identifier: virtueForm.identifier.trim(),
        name: virtueForm.name.trim(),
        description: virtueForm.description,
        variants: virtueForm.variants,
      })
      toast.add({ title: 'Vertu créée', color: 'success' })
    }
    await refresh()
    showVirtueModal.value = false
  }
  catch (err) {
    console.error(err)
    toast.add({ title: 'Erreur lors de la sauvegarde', color: 'error' })
  }
  finally {
    savingVirtue.value = false
  }
}

// ── Gestion des variantes dans le formulaire ─────────────────────────────────
function addVariant() {
  virtueForm.variants.push({ name: '', description: '', modifiers: [] })
}

function removeVariant(index: number) {
  virtueForm.variants.splice(index, 1)
}
</script>

<template>
  <div class="p-6 space-y-8">
    <!-- Fil d'ariane -->
    <div class="flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/gm/system" class="hover:text-gray-700">
        Système de jeu
      </NuxtLink>
      <UIcon name="i-heroicons-chevron-right" class="text-xs" />
      <span class="font-medium text-gray-900 dark:text-white">{{ culture?.name }}</span>
    </div>

    <!-- Édition de la culture -->
    <UCard>
      <template #header>
        <h2 class="text-lg font-semibold">
          Informations de la culture
        </h2>
      </template>

      <UForm :state="editForm" class="space-y-4" @submit="handleSave">
        <UFormField label="Nom" name="name" required>
          <UInput v-model="editForm.name" class="w-full" />
        </UFormField>

        <UFormField label="Description" name="description">
          <UTextarea v-model="editForm.description" rows="4" class="w-full" />
        </UFormField>

        <div class="grid grid-cols-3 gap-4">
          <UFormField label="Bonus Endurance" name="endurance_bonus">
            <UInput v-model.number="editForm.endurance_bonus" type="number" min="0" class="w-full" />
          </UFormField>
          <UFormField label="Bonus Espoir" name="hope_bonus">
            <UInput v-model.number="editForm.hope_bonus" type="number" min="0" class="w-full" />
          </UFormField>
          <UFormField label="Bonus Parade" name="parade_bonus">
            <UInput v-model.number="editForm.parade_bonus" type="number" min="0" class="w-full" />
          </UFormField>
        </div>

        <div class="flex justify-end">
          <UButton type="submit" label="Sauvegarder" :loading="saving" />
        </div>
      </UForm>
    </UCard>

    <!-- Vertus culturelles -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">
            Vertus culturelles
          </h2>
          <UButton
            icon="i-heroicons-plus"
            label="Ajouter une vertu"
            size="sm"
            @click="openCreateVirtue"
          />
        </div>
      </template>

      <div v-if="!culture?.cultural_virtues.length" class="py-8 text-center text-gray-400">
        <UIcon name="i-heroicons-sparkles" class="text-3xl mb-2" />
        <p>Aucune vertu culturelle</p>
      </div>

      <ul v-else class="divide-y divide-gray-100 dark:divide-gray-800">
        <li
          v-for="virtue in culture?.cultural_virtues"
          :key="virtue.id"
          class="py-4 flex items-start justify-between gap-4"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-medium text-gray-900 dark:text-white">{{ virtue.name }}</span>
              <UBadge variant="outline" size="sm">
                {{ virtue.identifier }}
              </UBadge>
            </div>
            <p class="text-sm text-gray-500 line-clamp-2">
              {{ virtue.description }}
            </p>
            <p v-if="virtue.variants.length" class="text-xs text-gray-400 mt-1">
              {{ virtue.variants.length }} variante{{ virtue.variants.length > 1 ? 's' : '' }}
            </p>
          </div>
          <div class="flex gap-2 shrink-0">
            <UButton icon="i-heroicons-pencil-square" variant="ghost" size="sm" @click="openEditVirtue(virtue)" />
            <UButton
              icon="i-heroicons-trash"
              variant="ghost"
              color="error"
              size="sm"
              @click="openDeleteConfirm(virtue.id, virtue.name)"
            />
          </div>
        </li>
      </ul>
    </UCard>

    <!-- Modale vertu culturelle -->
    <UModal
      v-model:open="showVirtueModal"
      :title="editingVirtue ? 'Modifier la vertu' : 'Nouvelle vertu culturelle'"
    >
      <template #body>
        <div class="space-y-4">
          <UFormField label="Identifiant (slug)" name="identifier" required>
            <UInput v-model="virtueForm.identifier" placeholder="ex: vigour_of_the_earth" class="w-full" />
          </UFormField>
          <UFormField label="Nom" name="name" required>
            <UInput v-model="virtueForm.name" placeholder="Nom de la vertu" class="w-full" />
          </UFormField>
          <UFormField label="Description" name="description">
            <UTextarea v-model="virtueForm.description" rows="3" class="w-full" />
          </UFormField>

          <!-- Variantes -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Variantes</span>
              <UButton
                icon="i-heroicons-plus"
                size="xs"
                variant="ghost"
                label="Ajouter"
                @click="addVariant"
              />
            </div>
            <div
              v-for="(variant, idx) in virtueForm.variants"
              :key="idx"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-medium text-gray-500">Variante {{ idx + 1 }}</span>
                <UButton
                  icon="i-heroicons-x-mark"
                  size="xs"
                  variant="ghost"
                  color="error"
                  @click="removeVariant(idx)"
                />
              </div>
              <UInput v-model="variant.name" placeholder="Nom de la variante" class="w-full" />
              <UTextarea v-model="variant.description" placeholder="Description de la variante" rows="2" class="w-full" />
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <UButton variant="ghost" label="Annuler" @click="showVirtueModal = false" />
            <UButton
              label="Sauvegarder"
              :loading="savingVirtue"
              :disabled="!virtueForm.identifier.trim() || !virtueForm.name.trim()"
              @click="handleSaveVirtue"
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
