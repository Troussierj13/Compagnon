<script setup lang="ts">
import type { SceneEntity } from '~/types/rpg'
import { ENTITY_TOKEN_COLOR, ENTITY_TOKEN_ICON } from '~/utils/entityDisplay'

defineProps<{ entity: SceneEntity }>()
</script>

<template>
  <div
    class="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    :style="{ left: `${entity.position.x}%`, top: `${entity.position.y}%` }"
  >
    <div
      class="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white"
      :class="ENTITY_TOKEN_COLOR[entity.type]"
    >
      <UIcon :name="ENTITY_TOKEN_ICON[entity.type]" class="text-sm" />
    </div>
    <div class="absolute top-full left-1/2 -translate-x-1/2 mt-0.5 whitespace-nowrap text-xs text-white bg-black/70 px-1 rounded">
      {{ entity.name }}
    </div>
  </div>
</template>
