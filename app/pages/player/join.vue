<script setup lang="ts">
definePageMeta({ layout: 'minimal' })

const { join, loading, error } = usePlayerSession()

const joinCode = ref('')
const playerName = ref('')

// Pré-remplir le code depuis l'URL si présent (?code=XK7P2M)
const route = useRoute()
if (route.query.code) {
  joinCode.value = String(route.query.code).toUpperCase()
}

// Prévisualisation de la session
const sessionPreview = ref<{ id: string; status: string; campaign: { name: string } } | null>(null)
const previewLoading = ref(false)

async function lookupSession() {
  const code = joinCode.value.trim().toUpperCase()
  if (code.length < 6) { sessionPreview.value = null; return }

  previewLoading.value = true
  sessionPreview.value = await $fetch(`/api/session/${code}`).catch(() => null) as typeof sessionPreview.value
  previewLoading.value = false
}

async function handleJoin() {
  const code = joinCode.value.trim()
  const name = playerName.value.trim()
  if (!code || !name) return
  const ok = await join(code, name)
  if (ok) {
    await navigateTo('/player/scene')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <UCard class="w-full max-w-sm">
      <template #header>
        <div class="text-center">
          <h2 class="text-xl font-bold">Rejoindre une session</h2>
          <p class="text-sm text-gray-400 mt-1">Entrez le code fourni par votre MJ</p>
        </div>
      </template>

      <form class="space-y-4" @submit.prevent="handleJoin">
        <UFormField label="Code de session">
          <UInput
            v-model="joinCode"
            placeholder="XK7P2M"
            maxlength="6"
            class="font-mono text-center text-lg tracking-widest uppercase"
            @input="joinCode = joinCode.toUpperCase(); lookupSession()"
          />
        </UFormField>

        <!-- Prévisualisation campagne -->
        <div v-if="previewLoading" class="text-center text-sm text-gray-500">
          <UIcon name="i-heroicons-arrow-path" class="animate-spin" /> Vérification...
        </div>
        <UAlert
          v-else-if="sessionPreview"
          color="green"
          variant="soft"
          :title="`Campagne : ${sessionPreview.campaign.name}`"
          icon="i-heroicons-check-circle"
        />

        <UFormField label="Votre prénom / pseudo">
          <UInput v-model="playerName" placeholder="Bilbon" />
        </UFormField>

        <UAlert
          v-if="error"
          color="red"
          variant="soft"
          :title="error"
          icon="i-heroicons-exclamation-circle"
        />

        <UButton
          type="submit"
          block
          :loading="loading"
          :disabled="!joinCode.trim() || !playerName.trim()"
        >
          Rejoindre la partie
        </UButton>
      </form>

      <template #footer>
        <UButton to="/" variant="ghost" size="sm" icon="i-heroicons-arrow-left">
          Retour
        </UButton>
      </template>
    </UCard>
  </div>
</template>
