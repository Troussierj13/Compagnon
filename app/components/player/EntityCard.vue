<script setup lang="ts">
import type { SceneEntity } from '~/types/rpg'

defineProps<{ entity: SceneEntity }>()

const colorMap: Record<string, string> = {
  npc: 'border-blue-900/50 bg-blue-950/30 text-blue-200',
  item: 'border-yellow-800/50 bg-yellow-950/30 text-yellow-200',
  zone: 'border-green-900/50 bg-green-950/30 text-green-200',
}
</script>

<template>
  <div
    class="border rounded-lg px-3 py-2 text-sm"
    :class="colorMap[entity.type] ?? 'border-gray-700 bg-gray-800 text-gray-200'"
  >
    <p class="font-medium">{{ entity.name }}</p>
    <p
      v-if="(entity.data as Record<string, unknown>).description"
      class="text-xs text-gray-400 mt-0.5"
    >
      {{ (entity.data as Record<string, unknown>).description }}
    </p>
  </div>
</template>
