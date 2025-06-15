<script setup lang="ts">
import { ref } from 'vue'
import { EditorService } from '@/services/editorService'
import { PageBreakService } from '@/services/pageBreakService'

const pageHeight = ref<number>(1000)
const editorRef = ref<HTMLElement | null>(null)
const pages = ref<string[]>([])
const editorContent = ref<string>(`
  <img src="https://placehold.co/700x300" alt="Placeholder image 1" />

  <br />

  <h2><b>This is the heading</b></h2>

  <br />

  <p>
    Break at <b>1200</b> for a list, or <b>820</b> for a table/image overflow. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
    ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
    dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
    amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
    invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et
    justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
    dolor sit amet.
  </p>

  <br />

  <p>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
    ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
    dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
    amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
    invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et
    justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
    dolor sit amet.
  </p>

  <br />

  <table border="1" style="width: 100%; margin: 10px 0">
    <tbody>
      <tr>
        <td>Cell 1</td>
        <td>Cell 2</td>
      </tr>
      <tr>
        <td>Cell 3</td>
        <td>Cell 4</td>
      </tr>
      <tr>
        <td>Cell 1</td>
        <td>Cell 2</td>
      </tr>
      <tr>
        <td>Cell 3</td>
        <td>Cell 4</td>
      </tr>
    </tbody>
  </table>

  <br />

  <p>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
    ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
    dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor
    sit amet.
  </p>

  <ul>
    <li>List item 1</li>
    <li>List item 2</li>
    <li>List item 3</li>
    <li>List item 4</li>
  </ul>

  <p>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
    ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
    dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
    amet.
  </p>

  <ul>
    <li>List item 1</li>
    <li>List item 2</li>
    <li>List item 3</li>
    <li>List item 4</li>
  </ul>

  <p>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
    ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
    dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
    amet.
  </p>

  <img src="https://placehold.co/700x600" alt="Placeholder image 2" />
`)

// Editor actions
const formatText = (command: 'bold' | 'italic' | 'underline'): void => {
  EditorService.formatText(command)
}

const insertTable = (): void => {
  EditorService.insertTable()
}

const insertList = (type: 'ul' | 'ol'): void => {
  EditorService.insertList(type)
}

const insertImage = (): void => {
  EditorService.insertImage()
}

const handleEditorFocus = (): void => {
  if (!editorRef.value) return
  EditorService.handleEditorFocus(editorRef.value)
}

// Page break functionality
const setPageBreak = (): void => {
  if (!editorRef.value) return

  console.log(`Creating pages with height limit: ${pageHeight.value}px`)

  const editor = editorRef.value
  const elements = Array.from(editor.children)

  const pageBreakService = new PageBreakService(editor)
  const resultPages = pageBreakService.processElements(elements, pageHeight.value)
  pages.value = resultPages

  console.log('Pages created:', resultPages)

  console.log(`Created ${resultPages.length} pages`)
}
</script>

<template>
  <div class="mx-auto my-5 max-w-4xl" id="rich-text-editor">
    <!-- Toolbar (buttons) -->
    <div
      id="toolbar"
      class="flex flex-wrap items-center gap-1 border border-gray-300 bg-gray-100 p-2.5"
    >
      <!-- Format Bold -->
      <button
        @click="formatText('bold')"
        title="Bold"
        class="mx-1 cursor-pointer rounded border border-gray-300 bg-white px-2.5 py-1 transition-colors hover:bg-gray-100 active:bg-blue-100"
      >
        <b>B</b>
      </button>

      <!-- Format Italics -->
      <button
        @click="formatText('italic')"
        title="Italic"
        class="mx-1 cursor-pointer rounded border border-gray-300 bg-white px-2.5 py-1 transition-colors hover:bg-gray-100 active:bg-blue-100"
      >
        <i>I</i>
      </button>

      <!-- Format Underline -->
      <button
        @click="formatText('underline')"
        title="Underline"
        class="mx-1 cursor-pointer rounded border border-gray-300 bg-white px-2.5 py-1 transition-colors hover:bg-gray-100 active:bg-blue-100"
      >
        <u>U</u>
      </button>

      <!-- Insert Table -->
      <button
        @click="insertTable"
        title="Insert Table"
        class="mx-1 cursor-pointer rounded border border-gray-300 bg-white px-2.5 py-1 transition-colors hover:bg-gray-100 active:bg-blue-100"
      >
        Table
      </button>

      <!-- Insert Unordered List -->
      <button
        @click="insertList('ul')"
        title="Bullet List"
        class="mx-1 cursor-pointer rounded border border-gray-300 bg-white px-2.5 py-1 transition-colors hover:bg-gray-100 active:bg-blue-100"
      >
        •
      </button>

      <!-- Insert Ordered List -->
      <button
        @click="insertList('ol')"
        title="Numbered List"
        class="mx-1 cursor-pointer rounded border border-gray-300 bg-white px-2.5 py-1 transition-colors hover:bg-gray-100 active:bg-blue-100"
      >
        1.
      </button>

      <!-- Add Image -->
      <button
        @click="insertImage"
        title="Insert Image"
        class="mx-1 cursor-pointer rounded border border-gray-300 bg-white px-2.5 py-1 transition-colors hover:bg-gray-100 active:bg-blue-100"
      >
        🖼️
      </button>

      <!-- Set Page Height -->
      <span class="ml-2.5 flex items-center gap-1">
        Page Height (px):
        <input
          v-model.number="pageHeight"
          type="number"
          min="100"
          max="4000"
          class="w-16 rounded border border-gray-300 bg-white p-1"
        />
        <button
          @click="setPageBreak"
          title="Set Page Break Height"
          class="cursor-pointer rounded border border-gray-300 bg-white px-2.5 py-1 transition-colors hover:bg-gray-100 active:bg-blue-100"
        >
          Set
        </button>
      </span>
    </div>

    <!-- Editor -->
    <div v-if="pages.length === 0">
      <!-- Default editor value -->
      <div
        ref="editorRef"
        id="editor"
        class="editor mt-0 min-h-72 border border-gray-300 p-5 leading-6 outline-none focus:border-blue-500 focus:shadow-sm"
        contenteditable="true"
        @focus="handleEditorFocus"
        v-html="editorContent"
      />
    </div>

    <!-- Pages View -->
    <div v-else>
      <div class="m-4 flex items-center gap-2">
        <span class="text-sm text-gray-600">
          {{ pages.length }} page{{ pages.length !== 1 ? 's' : '' }} created
        </span>
        <button
          @click="pages = []"
          class="rounded bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600"
        >
          Back to Editor
        </button>
      </div>

      <div
        v-for="(page, index) in pages"
        :key="index"
        class="page mb-4 border border-gray-300 bg-white p-5 shadow-sm"
        :style="{ height: pageHeight + 120 + 'px', overflow: 'hidden' }"
      >
        <div class="mb-2 text-xs text-gray-500">Page {{ index + 1 }}</div>
        <div v-html="page" class="page-content mb-24"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Global styles for editor content */
.editor :deep(table),
.page :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 10px 0;
  border: 1px solid #d1d5db;
}

.editor :deep(table td),
.page :deep(table td) {
  padding: 8px;
  border: 1px solid #d1d5db;
}

.editor :deep(ul),
.editor :deep(ol),
.page :deep(ul),
.page :deep(ol) {
  margin: 10px 0;
  padding-left: 32px;
}

/* Add these styles for list markers */
.editor :deep(ul),
.page :deep(ul) {
  list-style-type: disc;
}

.editor :deep(ol),
.page :deep(ol) {
  list-style-type: decimal;
}

.editor :deep(li),
.page :deep(li) {
  display: list-item;
}

.editor :deep(img),
.page :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 10px 0;
}

.page {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

@media print {
  .page {
    height: auto !important;
    overflow: visible !important;
    page-break-after: always;
  }
}
</style>
