<script setup lang="ts">
import type { TORCharacterData, TORSkill, TORWeapon } from '~/types/rpg'

definePageMeta({ middleware: 'gm' })

const route = useRoute()
const campaignId = route.params.id as string
const charId = route.params.charId as string

const { characters, fetchAll, updateData } = useCharacter(campaignId)
const saving = ref(false)
const saved = ref(false)

const character = computed(() => characters.value.find(c => c.id === charId))
const data = ref<TORCharacterData | null>(null)

onMounted(async () => {
  await fetchAll()
  if (character.value) {
    data.value = structuredClone(character.value.data)
  }
})

async function save() {
  if (!data.value) return
  saving.value = true
  await updateData(charId, data.value)
  saving.value = false
  saved.value = true
  setTimeout(() => { saved.value = false }, 2000)
}

function addSkill(group: 'skills_strength' | 'skills_heart' | 'skills_mind') {
  if (!data.value) return
  data.value[group].push({ name: '', rank: 0, favoured: false })
}

function removeSkill(group: 'skills_strength' | 'skills_heart' | 'skills_mind', idx: number) {
  if (!data.value) return
  data.value[group].splice(idx, 1)
}

function addWeapon() {
  if (!data.value) return
  data.value.weapons.push({ name: '', damage: 5, injury: 16, load: 2 })
}

function removeWeapon(idx: number) {
  if (!data.value) return
  data.value.weapons.splice(idx, 1)
}
</script>

<template>
  <div class="min-h-screen p-6 max-w-3xl mx-auto">
    <div class="flex items-center gap-2 text-sm text-gray-400 mb-6">
      <NuxtLink to="/gm" class="hover:text-white">Campagnes</NuxtLink>
      <UIcon name="i-heroicons-chevron-right" />
      <NuxtLink :to="`/gm/campaigns/${campaignId}`" class="hover:text-white">Campagne</NuxtLink>
      <UIcon name="i-heroicons-chevron-right" />
      <span class="text-white">{{ character?.name }}</span>
    </div>

    <div v-if="!data" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-2xl" />
    </div>

    <template v-else>
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">{{ character?.name }}</h1>
        <UButton :loading="saving" :color="saved ? 'green' : 'primary'" @click="save">
          {{ saved ? 'Sauvegardé !' : 'Sauvegarder' }}
        </UButton>
      </div>

      <div class="space-y-8">
        <!-- Identité -->
        <section>
          <h2 class="section-title">Identité</h2>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Culture">
              <UInput v-model="data.culture" />
            </UFormField>
            <UFormField label="Vocation">
              <UInput v-model="data.vocation" />
            </UFormField>
            <UFormField label="Niveau de vie">
              <UInput v-model="data.standard_of_living" />
            </UFormField>
          </div>
        </section>

        <!-- Attributs -->
        <section>
          <h2 class="section-title">Attributs principaux</h2>
          <div class="grid grid-cols-3 gap-4">
            <UFormField label="Force">
              <UInput v-model.number="data.attributes.strength" type="number" min="1" max="7" />
            </UFormField>
            <UFormField label="Cœur">
              <UInput v-model.number="data.attributes.heart" type="number" min="1" max="7" />
            </UFormField>
            <UFormField label="Esprit">
              <UInput v-model.number="data.attributes.mind" type="number" min="1" max="7" />
            </UFormField>
          </div>
        </section>

        <!-- Secondaires -->
        <section>
          <h2 class="section-title">Attributs secondaires</h2>
          <div class="grid grid-cols-3 gap-4">
            <UFormField label="Endurance max">
              <UInput v-model.number="data.endurance_max" type="number" min="1" />
            </UFormField>
            <UFormField label="Endurance actuelle">
              <UInput v-model.number="data.endurance_current" type="number" min="0" :max="data.endurance_max" />
            </UFormField>
            <UFormField label="Espoir max">
              <UInput v-model.number="data.hope_max" type="number" min="1" />
            </UFormField>
            <UFormField label="Espoir actuel">
              <UInput v-model.number="data.hope_current" type="number" min="0" :max="data.hope_max" />
            </UFormField>
            <UFormField label="Ombre">
              <UInput v-model.number="data.shadow" type="number" min="0" />
            </UFormField>
            <UFormField label="Parade">
              <UInput v-model.number="data.parry" type="number" min="0" />
            </UFormField>
          </div>
        </section>

        <!-- Compétences -->
        <section
          v-for="[label, group] in ([
            ['Compétences Force', 'skills_strength'],
            ['Compétences Cœur', 'skills_heart'],
            ['Compétences Esprit', 'skills_mind'],
          ] as [string, keyof TORCharacterData][])"
          :key="group"
        >
          <div class="flex items-center justify-between mb-2">
            <h2 class="section-title">{{ label }}</h2>
            <UButton size="xs" icon="i-heroicons-plus" @click="addSkill(group as 'skills_strength' | 'skills_heart' | 'skills_mind')" />
          </div>
          <div class="space-y-2">
            <div
              v-for="(skill, idx) in (data[group] as TORSkill[])"
              :key="idx"
              class="flex items-center gap-2"
            >
              <UInput v-model="skill.name" placeholder="Nom" class="flex-1" />
              <UInput v-model.number="skill.rank" type="number" min="0" max="6" class="w-16" />
              <UToggle v-model="skill.favoured" />
              <span class="text-xs text-gray-500">Fav.</span>
              <UButton size="xs" color="red" variant="ghost" icon="i-heroicons-trash" @click="removeSkill(group as 'skills_strength' | 'skills_heart' | 'skills_mind', idx)" />
            </div>
          </div>
        </section>

        <!-- Armes -->
        <section>
          <div class="flex items-center justify-between mb-2">
            <h2 class="section-title">Armement</h2>
            <UButton size="xs" icon="i-heroicons-plus" @click="addWeapon" />
          </div>
          <div class="space-y-2">
            <div
              v-for="(w, idx) in (data.weapons as TORWeapon[])"
              :key="idx"
              class="grid grid-cols-5 gap-2 items-center"
            >
              <UInput v-model="w.name" placeholder="Nom" class="col-span-2" />
              <UInput v-model.number="w.damage" type="number" placeholder="Dégâts" />
              <UInput v-model.number="w.injury" type="number" placeholder="Blessure" />
              <UButton size="xs" color="red" variant="ghost" icon="i-heroicons-trash" @click="removeWeapon(idx)" />
            </div>
          </div>
        </section>

        <!-- XP -->
        <section>
          <h2 class="section-title">Progression</h2>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Expérience">
              <UInput v-model.number="data.experience" type="number" min="0" />
            </UFormField>
            <UFormField label="Avancement">
              <UInput v-model.number="data.advancement" type="number" min="0" />
            </UFormField>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<style scoped>
.section-title {
  @apply text-sm uppercase text-gray-500 font-semibold mb-3;
}
</style>
