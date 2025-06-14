<script setup lang="ts">
import RichTextEditor from '../components/RichTextEditor.vue'
</script>

<template>
  <main id="homepage">
    <!-- Navbar -->
    <nav class="flex justify-between items-center px-6 py-4 bg-slate-50 shadow-md mb-8">
      <!-- Logo -->
      <div class="flex items-center gap-2 font-bold tracking-wide text-xl">
        <span>Page Breaker</span>
        <img
          src="/favicon_io/apple-touch-icon.png"
          alt="Broken heart logo"
          class="size-4 animate-pulse mt-1"
        />
      </div>
      <!-- Right-side links -->
      <div class="gap-8 flex items-center">
        <!-- Original HTML Reference -->
        <a
          href="https://app.avayl.tech/coding_task.html"
          target="_blank"
          rel="noopener noreferrer"
          class="text-base font-medium text-blue-600 hover:underline"
        >
          Original HTML
        </a>
        <!-- GitHub Repo -->
        <a
          href="https://github.com/LouisLP/page-breaker"
          target="_blank"
          rel="noopener noreferrer"
          class="text-base font-medium text-blue-600 hover:underline"
        >
          GitHub Repo
        </a>
      </div>
    </nav>

    <!-- Editor -->
    <RichTextEditor />
  </main>
</template>
