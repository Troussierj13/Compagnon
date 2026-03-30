<script setup lang="ts">
definePageMeta({ layout: 'minimal' })

const supabase = useSupabaseClient()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

async function login() {
  loading.value = true
  error.value = null

  const { error: err } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (err) {
    error.value = err.message
  } else {
    await router.push('/gm')
  }
  loading.value = false
}

// Rediriger si déjà connecté
const user = useSupabaseUser()
watchEffect(() => {
  if (user.value) router.push('/gm')
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <UCard class="w-full max-w-sm">
      <template #header>
        <div class="text-center">
          <h2 class="text-xl font-bold">Connexion Maître du Jeu</h2>
          <p class="text-sm text-gray-400 mt-1">Accès réservé au MJ</p>
        </div>
      </template>

      <form class="space-y-4" @submit.prevent="login">
        <UFormGroup label="Email">
          <UInput
            v-model="email"
            type="email"
            placeholder="mj@exemple.com"
            autocomplete="email"
            required
          />
        </UFormGroup>

        <UFormGroup label="Mot de passe">
          <UInput
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
          />
        </UFormGroup>

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
        >
          Se connecter
        </UButton>
      </form>

      <template #footer>
        <UButton to="/" variant="ghost" size="sm" icon="i-heroicons-arrow-left">
          Retour à l'accueil
        </UButton>
      </template>
    </UCard>
  </div>
</template>
