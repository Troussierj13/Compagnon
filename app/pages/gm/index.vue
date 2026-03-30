<script setup lang="ts">
import type { Campaign } from '~/types/rpg'

definePageMeta({ middleware: 'gm' })

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const campaigns = ref<Campaign[]>([])
const loading = ref(true)
const showNewCampaign = ref(false)
const newCampaignName = ref('')
const newCampaignDesc = ref('')
const creating = ref(false)

async function fetchCampaigns() {
  const { data } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false })
  campaigns.value = (data as Campaign[]) ?? []
  loading.value = false
}

async function createCampaign() {
  if (!newCampaignName.value.trim()) return
  creating.value = true

  const { data, error: insertError } = await supabase
    .from('campaigns')
    .insert({
      name: newCampaignName.value.trim(),
      description: newCampaignDesc.value.trim() || null,
      gm_user_id: user.value!.id,
    })
    .select()
    .single()

  if (insertError) {
    console.error('Erreur création campagne:', insertError)
    creating.value = false
    return
  }

  if (data) {
    campaigns.value.unshift(data as Campaign)
    newCampaignName.value = ''
    newCampaignDesc.value = ''
    showNewCampaign.value = false
  }
  creating.value = false
}

async function logout() {
  await supabase.auth.signOut()
  navigateTo('/login')
}

onMounted(fetchCampaigns)
</script>

<template>
  <div class="min-h-screen p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold">Mes Campagnes</h1>
        <p class="text-gray-400 text-sm">{{ user?.email }}</p>
      </div>
      <div class="flex gap-2">
        <UButton
          color="primary"
          icon="i-heroicons-plus"
          @click="showNewCampaign = true"
        >
          Nouvelle campagne
        </UButton>
        <UButton variant="ghost" icon="i-heroicons-arrow-right-on-rectangle" @click="logout">
          Déconnexion
        </UButton>
      </div>
    </div>

    <!-- Modal nouvelle campagne -->
    <UModal v-model:open="showNewCampaign" title="Nouvelle campagne">
      <template #body>
        <div class="space-y-4">
          <UFormField label="Nom de la campagne" required>
            <UInput v-model="newCampaignName" placeholder="La Quête de l'Anneau Unique..." />
          </UFormField>
          <UFormField label="Description">
            <UTextarea v-model="newCampaignDesc" placeholder="Notes sur la campagne..." rows="3" />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="showNewCampaign = false">Annuler</UButton>
          <UButton :loading="creating" @click="createCampaign">Créer</UButton>
        </div>
      </template>
    </UModal>

    <!-- Liste des campagnes -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-2xl" />
    </div>

    <div v-else-if="campaigns.length === 0" class="text-center py-12 text-gray-500">
      <UIcon name="i-heroicons-book-open" class="text-4xl mb-3" />
      <p>Aucune campagne. Créez-en une pour commencer !</p>
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <UCard
        v-for="campaign in campaigns"
        :key="campaign.id"
        class="hover:ring-2 hover:ring-primary-500 transition cursor-pointer"
        @click="navigateTo(`/gm/campaigns/${campaign.id}`)"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-lg truncate">{{ campaign.name }}</h3>
            <p v-if="campaign.description" class="text-sm text-gray-400 mt-1 line-clamp-2">
              {{ campaign.description }}
            </p>
            <p class="text-xs text-gray-500 mt-2">
              {{ new Date(campaign.created_at).toLocaleDateString('fr-FR') }}
            </p>
          </div>
          <UBadge color="neutral" variant="soft" class="shrink-0 ml-2">
            {{ campaign.system }}
          </UBadge>
        </div>
      </UCard>
    </div>
  </div>
</template>
