<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="container mx-auto p-4 flex justify-between items-center">
      <h1 class="text-xl font-bold">Running Pace Calculator</h1>
      <ThemeToggle />
    </header>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import ThemeToggle from '~/components/ThemeToggle.vue'
</script>
