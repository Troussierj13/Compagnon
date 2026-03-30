<script setup lang="ts">
import type { Character, TORCharacterData } from '~/types/rpg'

const props = defineProps<{ character: Character }>()
const data = computed<TORCharacterData>(() => props.character.data)

function attrPercent(current: number, max: number) {
  return max > 0 ? Math.round((current / max) * 100) : 0
}
</script>

<template>
  <div class="space-y-6 max-w-2xl mx-auto">
    <!-- Identité -->
    <div class="grid grid-cols-3 gap-3 text-center">
      <div class="bg-gray-800 rounded-lg p-3">
        <p class="text-xs text-gray-500 uppercase">Culture</p>
        <p class="font-medium mt-1">{{ data.culture || '—' }}</p>
      </div>
      <div class="bg-gray-800 rounded-lg p-3">
        <p class="text-xs text-gray-500 uppercase">Vocation</p>
        <p class="font-medium mt-1">{{ data.vocation || '—' }}</p>
      </div>
      <div class="bg-gray-800 rounded-lg p-3">
        <p class="text-xs text-gray-500 uppercase">Niveau de vie</p>
        <p class="font-medium mt-1 text-sm">{{ data.standard_of_living || '—' }}</p>
      </div>
    </div>

    <!-- Attributs principaux -->
    <div>
      <h3 class="text-xs uppercase text-gray-500 mb-2">Attributs</h3>
      <div class="grid grid-cols-3 gap-3">
        <div
          v-for="(attr, key) in { Force: data.attributes.strength, Cœur: data.attributes.heart, Esprit: data.attributes.mind }"
          :key="key"
          class="bg-gray-800 rounded-xl p-4 text-center"
        >
          <p class="text-xs text-gray-500 uppercase mb-1">{{ key }}</p>
          <p class="text-3xl font-bold text-primary-400">{{ attr }}</p>
          <p class="text-xs text-gray-500 mt-1">SR : {{ 20 - attr }}</p>
        </div>
      </div>
    </div>

    <!-- Attributs secondaires -->
    <div class="grid grid-cols-2 gap-3">
      <!-- Endurance -->
      <div class="bg-gray-800 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs text-gray-500 uppercase">Endurance</span>
          <span class="text-sm font-mono">{{ data.endurance_current }}/{{ data.endurance_max }}</span>
        </div>
        <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full bg-green-500 transition-all"
            :style="{ width: `${attrPercent(data.endurance_current, data.endurance_max)}%` }"
          />
        </div>
      </div>

      <!-- Espoir -->
      <div class="bg-gray-800 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs text-gray-500 uppercase">Espoir</span>
          <span class="text-sm font-mono">{{ data.hope_current }}/{{ data.hope_max }}</span>
        </div>
        <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full bg-blue-400 transition-all"
            :style="{ width: `${attrPercent(data.hope_current, data.hope_max)}%` }"
          />
        </div>
      </div>

      <div class="bg-gray-800 rounded-lg p-3 text-center">
        <p class="text-xs text-gray-500 uppercase">Ombre</p>
        <p class="text-2xl font-bold text-purple-400">{{ data.shadow }}</p>
      </div>

      <div class="bg-gray-800 rounded-lg p-3 text-center">
        <p class="text-xs text-gray-500 uppercase">Parade</p>
        <p class="text-2xl font-bold">{{ data.parry }}</p>
      </div>
    </div>

    <!-- Compétences -->
    <div class="space-y-4">
      <h3 class="text-xs uppercase text-gray-500">Compétences</h3>

      <div
        v-for="[label, skills] in [
          ['Force', data.skills_strength],
          ['Cœur', data.skills_heart],
          ['Esprit', data.skills_mind],
        ]"
        :key="label"
      >
        <p class="text-xs text-gray-400 mb-1">{{ label }}</p>
        <div v-if="(skills as TORCharacterData['skills_strength']).length === 0" class="text-gray-600 text-sm">
          Aucune compétence.
        </div>
        <div class="space-y-1">
          <div
            v-for="skill in (skills as TORCharacterData['skills_strength'])"
            :key="skill.name"
            class="flex items-center gap-2 text-sm"
          >
            <span
              v-if="skill.favoured"
              class="w-2 h-2 rounded-full bg-primary-400 shrink-0"
              title="Favorisée"
            />
            <span v-else class="w-2 h-2 rounded-full bg-gray-600 shrink-0" />
            <span class="flex-1">{{ skill.name }}</span>
            <span class="font-mono text-gray-400">{{ skill.rank }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Armement -->
    <div v-if="data.weapons.length > 0">
      <h3 class="text-xs uppercase text-gray-500 mb-2">Armement</h3>
      <div class="space-y-1">
        <div
          v-for="w in data.weapons"
          :key="w.name"
          class="flex items-center gap-3 text-sm bg-gray-800 rounded px-3 py-2"
        >
          <span class="flex-1 font-medium">{{ w.name }}</span>
          <span class="text-gray-400">Dégâts {{ w.damage }}</span>
          <span class="text-red-400">Blessure {{ w.injury }}</span>
        </div>
      </div>
    </div>

    <!-- Vertus & Récompenses -->
    <div v-if="data.virtues.length > 0 || data.rewards.length > 0" class="grid grid-cols-2 gap-4">
      <div v-if="data.virtues.length > 0">
        <h3 class="text-xs uppercase text-gray-500 mb-2">Vertus</h3>
        <div v-for="v in data.virtues" :key="v.name" class="text-sm mb-1">
          <p class="font-medium text-primary-300">{{ v.name }}</p>
          <p class="text-gray-500 text-xs">{{ v.description }}</p>
        </div>
      </div>
      <div v-if="data.rewards.length > 0">
        <h3 class="text-xs uppercase text-gray-500 mb-2">Récompenses</h3>
        <div v-for="r in data.rewards" :key="r.name" class="text-sm mb-1">
          <p class="font-medium text-yellow-300">{{ r.name }}</p>
          <p class="text-gray-500 text-xs">{{ r.description }}</p>
        </div>
      </div>
    </div>

    <!-- XP -->
    <div class="grid grid-cols-2 gap-3 text-center">
      <div class="bg-gray-800 rounded-lg p-3">
        <p class="text-xs text-gray-500 uppercase">Expérience</p>
        <p class="text-2xl font-bold text-primary-400">{{ data.experience }}</p>
      </div>
      <div class="bg-gray-800 rounded-lg p-3">
        <p class="text-xs text-gray-500 uppercase">Avancement</p>
        <p class="text-2xl font-bold">{{ data.advancement }}</p>
      </div>
    </div>
  </div>
</template>
