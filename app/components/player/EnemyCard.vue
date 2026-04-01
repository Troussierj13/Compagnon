<script setup lang="ts">
import type { SceneEntity, EnemyData } from '~/types/rpg'

const props = defineProps<{ entity: SceneEntity }>()

const data = computed(() => props.entity.data as EnemyData)
const hpPercent = computed(() =>
  data.value.endurance_max > 0
    ? Math.round((data.value.endurance / data.value.endurance_max) * 100)
    : 0,
)
const hpColor = computed(() => {
  if (hpPercent.value > 60) return 'bg-green-500'
  if (hpPercent.value > 30) return 'bg-yellow-500'
  return 'bg-red-500'
})
</script>

<template>
  <div class="bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2">
    <div class="flex items-center justify-between mb-1">
      <span class="font-medium text-sm text-red-200">{{ entity.name }}</span>
      <span class="text-xs text-red-400 font-mono">
        {{ data.endurance }}/{{ data.endurance_max }}
      </span>
    </div>
    <!-- Barre d'endurance -->
    <div class="h-1.5 bg-gray-800 rounded-full overflow-hidden">
      <div
        class="h-full transition-all duration-300 rounded-full"
        :class="hpColor"
        :style="{ width: `${hpPercent}%` }"
      />
    </div>
    <div v-if="data.parry != null || data.armor != null" class="flex gap-3 mt-1.5 text-xs text-gray-500">
      <span v-if="data.parry != null">Parade {{ data.parry }}</span>
      <span v-if="data.armor != null">Armure {{ data.armor }}</span>
    </div>
  </div>
</template>
