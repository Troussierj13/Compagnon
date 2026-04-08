<script setup lang="ts">
definePageMeta({
  layout: 'minimal',
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

// Déjà connecté → rediriger vers le dashboard MJ
if (user.value) {
  await navigateTo('/gm')
}

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref<string | null>(null)

async function login() {
  error.value = null
  loading.value = true
  try {
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    })
    if (authError) throw authError
    await navigateTo('/gm')
  } catch (e: any) {
    error.value = e.message ?? 'Erreur de connexion'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-950">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h1 class="text-xl font-bold text-center">Compagnon JdR — MJ</h1>
      </template>

      <UAlert v-if="error" color="red" variant="soft" :description="error" class="mb-4" />

      <UForm :state="form" @submit="login" class="space-y-4">
        <UFormField label="Email" name="email">
          <UInput
            v-model="form.email"
            type="email"
            placeholder="mj@example.com"
            autocomplete="email"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Mot de passe" name="password">
          <UInput
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            class="w-full"
          />
        </UFormField>

        <UButton type="submit" :loading="loading" block>
          Se connecter
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>
