<script setup lang="ts">
import type { SceneEntity } from '~/types/rpg'
import { ENTITY_TOKEN_COLOR, ENTITY_TOKEN_ICON } from '~/utils/entityDisplay'

const props = defineProps<{ entity: SceneEntity }>()
const emit = defineEmits<{
  update: [patch: Partial<SceneEntity>]
  remove: []
}>()

const showMenu = ref(false)

// Drag & drop simplifié (positionnement CSS absolu en %)
const style = computed(() => ({
  left: `${props.entity.position.x}%`,
  top: `${props.entity.position.y}%`,
}))
</script>

<template>
  <div
    class="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
    :style="style"
    @click.stop="showMenu = !showMenu"
  >
    <!-- Token -->
    <div
      class="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg border-2 transition"
      :class="[
        ENTITY_TOKEN_COLOR[entity.type],
        entity.visible_to_players ? 'border-white' : 'border-gray-500 opacity-60',
      ]"
    >
      <UIcon :name="ENTITY_TOKEN_ICON[entity.type]" class="text-sm" />
    </div>

    <!-- Label -->
    <div class="absolute top-full left-1/2 -translate-x-1/2 mt-0.5 whitespace-nowrap text-xs text-white bg-black/70 px-1 rounded pointer-events-none">
      {{ entity.name }}
    </div>

    <!-- Menu contextuel -->
    <div
      v-if="showMenu"
      class="absolute left-full top-0 ml-2 z-20 bg-gray-800 rounded-lg shadow-xl border border-gray-700 text-sm p-1 min-w-32"
      @click.stop
    >
      <button
        class="w-full text-left px-3 py-1.5 hover:bg-gray-700 rounded flex items-center gap-2"
        @click="emit('update', { visible_to_players: !entity.visible_to_players }); showMenu = false"
      >
        <UIcon :name="entity.visible_to_players ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" />
        {{ entity.visible_to_players ? 'Cacher' : 'Révéler' }}
      </button>
      <button
        class="w-full text-left px-3 py-1.5 hover:bg-red-900/50 text-red-400 rounded flex items-center gap-2"
        @click="emit('remove'); showMenu = false"
      >
        <UIcon name="i-heroicons-trash" />
        Supprimer
      </button>
    </div>
  </div>
</template>
