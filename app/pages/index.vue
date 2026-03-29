<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-8 p-6">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-100 mb-2">Compagnon JdR</h1>
      <p class="text-gray-400">Aide à la gestion de campagne pour The One Ring</p>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 w-full max-w-md">
      <UButton
        to="/gm"
        size="xl"
        class="flex-1 justify-center"
        color="primary"
        icon="i-heroicons-shield-check"
      >
        Espace MJ
      </UButton>

      <UButton
        to="/player/join"
        size="xl"
        class="flex-1 justify-center"
        color="neutral"
        variant="outline"
        icon="i-heroicons-user-group"
      >
        Rejoindre une partie
      </UButton>
    </div>
  </div>
</template>
