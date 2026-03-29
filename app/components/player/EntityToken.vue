<script setup lang="ts">
import type { SceneEntity } from '~/types/rpg'

defineProps<{ entity: SceneEntity }>()

const colorMap: Record<string, string> = {
  enemy: 'bg-red-600',
  npc: 'bg-blue-600',
  item: 'bg-yellow-500',
  zone: 'bg-green-700',
}

const iconMap: Record<string, string> = {
  enemy: 'i-heroicons-skull',
  npc: 'i-heroicons-user',
  item: 'i-heroicons-gift',
  zone: 'i-heroicons-map-pin',
}
</script>

<template>
  <div
    class="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    :style="{ left: `${entity.position.x}%`, top: `${entity.position.y}%` }"
  >
    <div
      class="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white"
      :class="colorMap[entity.type]"
    >
      <UIcon :name="iconMap[entity.type]" class="text-sm" />
    </div>
    <div class="absolute top-full left-1/2 -translate-x-1/2 mt-0.5 whitespace-nowrap text-xs text-white bg-black/70 px-1 rounded">
      {{ entity.name }}
    </div>
  </div>
</template>
