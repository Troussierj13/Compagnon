<script setup lang="ts">
import type { SceneEntity } from '~/types/rpg'

const props = defineProps<{ entity: SceneEntity }>()

const colorMap: Record<string, string> = {
  npc: 'border-blue-900/50 bg-blue-950/30 text-blue-200',
  item: 'border-yellow-800/50 bg-yellow-950/30 text-yellow-200',
  zone: 'border-green-900/50 bg-green-950/30 text-green-200',
}

// EntityData peut être EnemyData, ItemData, ZoneData — seuls ItemData et ZoneData ont description
const description = computed<string | undefined>(() => {
  const data = props.entity.data
  if (data && typeof data === 'object' && 'description' in data) {
    return (data as { description: string }).description
  }
  return undefined
})
</script>

<template>
  <div
    class="border rounded-lg px-3 py-2 text-sm"
    :class="colorMap[entity.type] ?? 'border-gray-700 bg-gray-800 text-gray-200'"
  >
    <p class="font-medium">{{ entity.name }}</p>
    <p v-if="description" class="text-xs text-gray-400 mt-0.5">
      {{ description }}
    </p>
  </div>
</template>
