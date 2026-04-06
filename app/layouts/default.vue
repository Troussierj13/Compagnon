<template>
  <div class="min-h-screen bg-gray-950 text-gray-100">
    <!-- Navigation back-office MJ -->
    <nav class="border-b border-gray-800 bg-gray-900 px-4 py-3">
      <div class="mx-auto flex max-w-screen-xl items-center justify-between">
        <NuxtLink to="/gm" class="flex items-center gap-2 text-lg font-semibold text-white">
          <span>Compagnon JdR</span>
        </NuxtLink>

        <div class="flex items-center gap-4">
          <NuxtLink to="/gm" class="text-sm text-gray-400 hover:text-white transition-colors">
            Campagnes
          </NuxtLink>
          <NuxtLink to="/gm/system" class="text-sm text-gray-400 hover:text-white transition-colors">
            Système
          </NuxtLink>
          <NuxtLink to="/gm/nfc" class="text-sm text-gray-400 hover:text-white transition-colors">
            NFC
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Contenu principal -->
    <main class="mx-auto max-w-screen-xl px-4 py-6">
      <slot />
    </main>
  </div>
</template>
