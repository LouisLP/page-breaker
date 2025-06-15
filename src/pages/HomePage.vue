<script setup lang="ts">
import RichTextEditor from '../components/RichTextEditor.vue'
</script>

<template>
  <main id="homepage">
    <!-- Navbar -->
    <nav class="mb-8 flex items-center justify-between bg-slate-50 px-6 py-4 shadow-md">
      <!-- Logo -->
      <div class="flex items-center gap-2 text-xl font-bold tracking-wide">
        <span>Page Breaker</span>
        <img
          src="/favicon_io/apple-touch-icon.png"
          alt="Broken heart logo"
          class="mt-1 size-4 animate-pulse"
        />
      </div>
      <!-- Right-side links -->
      <div class="flex items-center gap-8">
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
