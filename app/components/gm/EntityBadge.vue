<script setup lang="ts">
import type { SceneEntity, EnemyData } from '~/types/rpg'

const props = defineProps<{ entity: SceneEntity }>()
defineEmits<{
  toggleVisibility: []
  remove: []
}>()

const colorMap: Record<string, string> = {
  enemy: 'red',
  npc: 'blue',
  item: 'yellow',
  zone: 'green',
}

const enemyData = computed(() =>
  props.entity.type === 'enemy' ? (props.entity.data as EnemyData) : null,
)
</script>

<template>
  <div
    class="flex items-center gap-2 px-2 py-1 rounded-lg text-sm border"
    :class="entity.visible_to_players ? 'border-gray-700 bg-gray-800' : 'border-gray-800 bg-gray-900 opacity-60'"
  >
    <UBadge :color="colorMap[entity.type] as 'red' | 'blue' | 'yellow' | 'green'" variant="soft" size="xs">
      {{ entity.type }}
    </UBadge>

    <span class="font-medium truncate max-w-24">{{ entity.name }}</span>

    <span v-if="enemyData" class="text-xs text-gray-400">
      {{ enemyData.endurance }}/{{ enemyData.endurance_max }}
    </span>

    <div class="flex gap-1 ml-auto">
      <UButton
        size="xs"
        variant="ghost"
        :icon="entity.visible_to_players ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'"
        :color="entity.visible_to_players ? 'neutral' : 'gray'"
        @click="$emit('toggleVisibility')"
      />
      <UButton
        size="xs"
        variant="ghost"
        color="red"
        icon="i-heroicons-x-mark"
        @click="$emit('remove')"
      />
    </div>
  </div>
</template>
