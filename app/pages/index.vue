<script setup lang="ts">
definePageMeta({
  layout: false
})

const user = useSupabaseUser()

if (import.meta.client) {
  if (user.value) {
    await navigateTo('/gm')
  } else {
    await navigateTo('/login')
  }
}
</script>

<template>
  <div />
</template>
