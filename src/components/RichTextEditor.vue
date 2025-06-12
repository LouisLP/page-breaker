<script setup lang="ts">
import { ref } from 'vue'

const pageHeight = ref<number>(1000)
const editorRef = ref<HTMLElement | null>(null)
const editorContent = ref<string>(`
<div><img src="https://placehold.co/700x300" alt="Placeholder image 1" /></div>
<br />
<div><br /></div>
<div><br /></div>
<div><b>This is the heading</b></div>
<div>
  <b><br /></b>
</div>
<div>
  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
  labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
  dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
  amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
  invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et
  justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
  dolor sit amet.
</div>
<div><br /></div>
<div>
  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
  labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
  dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
  amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
  invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et
  justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
  dolor sit amet.
</div>
<div><br /></div>
<div><br /></div>
<div>
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
</div>
<div><br /></div>
<div>
  <div>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
    ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
    dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor
    sit amet.
  </div>
  <br />
</div>
<div>
  <ul>
    <li>List item</li>
    <li>another</li>
    <li>item</li>
    <li>item</li>
  </ul>
  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
  labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
  dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
  amet.
</div>
<div><br /></div>
<div>
  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
  labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
  dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
  amet.
</div>
<div><img src="https://placehold.co/700x600" alt="Placeholder image 1" /></div>
`)

// Methods
const formatText = (command: 'bold' | 'italic' | 'underline'): void => {
  document.execCommand(command, false, undefined)
}

const insertTable = (): void => {
  const table = `
    <table border="1" style="width: 100%; margin: 10px 0;">
        <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
        </tr>
        <tr>
            <td>Cell 3</td>
            <td>Cell 4</td>
        </tr>
    </table>
  `
  document.execCommand('insertHTML', false, table)
}

const insertList = (type: 'ul' | 'ol'): void => {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return

  const range = selection.getRangeAt(0)
  const list = document.createElement(type)
  const listItem = document.createElement('li')
  listItem.textContent = 'List item'
  list.appendChild(listItem)

  range.deleteContents()
  range.insertNode(list)

  // Create a new list item and set cursor inside it
  const newItem = document.createElement('li')
  newItem.appendChild(document.createElement('br'))
  list.appendChild(newItem)

  // Set cursor to the new item
  const newRange = document.createRange()
  newRange.setStart(newItem, 0)
  newRange.collapse(true)
  selection.removeAllRanges()
  selection.addRange(newRange)
}

const insertImage = (): void => {
  const imageUrl = prompt('Please enter the image URL:')
  if (imageUrl) {
    const img = `<img src="${imageUrl}" alt="Inserted image" style="max-width: 100%; height: auto;">`
    document.execCommand('insertHTML', false, img)
  }
}

const handleEditorFocus = (): void => {
  if (!editorRef.value) return

  const editor = editorRef.value
  if (editor.textContent === 'Start typing here...') {
    editor.textContent = ''
  }
}

const setPageBreak = (): void => {
  console.log(`Setting page break at ${pageHeight.value}px`)
  // TODO: Implement page break algorithm
  if (!editorRef.value) return

  const editor = editorRef.value
  const targetHeight = pageHeight.value

  console.log('Current editor height:', editor.scrollHeight)
  console.log('Target page height:', targetHeight)
}
</script>

<template>
  <div class="max-w-4xl mx-auto my-5" id="rich-text-editor">
    <!-- Toolbar (buttons) -->
    <div
      id="toolbar"
      class="bg-gray-100 p-2.5 border border-gray-300 border-b-0 flex items-center flex-wrap gap-1"
    >
      <!-- Format Bold -->
      <button
        @click="formatText('bold')"
        title="Bold"
        class="mx-1 px-2.5 py-1 cursor-pointer border border-gray-300 bg-white rounded transition-colors hover:bg-gray-100 active:bg-blue-100"
      >
        <b>B</b>
      </button>

      <!-- Format Italics -->
      <button
        @click="formatText('italic')"
        title="Italic"
        class="mx-1 px-2.5 py-1 cursor-pointer border border-gray-300 bg-white rounded transition-colors hover:bg-gray-100 active:bg-blue-100"
      >
        <i>I</i>
      </button>

      <!-- Format Underline -->
      <button
        @click="formatText('underline')"
        title="Underline"
        class="mx-1 px-2.5 py-1 cursor-pointer border border-gray-300 bg-white rounded transition-colors hover:bg-gray-100 active:bg-blue-100"
      >
        <u>U</u>
      </button>

      <!-- Insert Table -->
      <button
        @click="insertTable"
        title="Insert Table"
        class="mx-1 px-2.5 py-1 cursor-pointer border border-gray-300 bg-white rounded transition-colors hover:bg-gray-100 active:bg-blue-100"
      >
        Table
      </button>

      <!-- Insert Unordered List -->
      <button
        @click="insertList('ul')"
        title="Bullet List"
        class="mx-1 px-2.5 py-1 cursor-pointer border border-gray-300 bg-white rounded transition-colors hover:bg-gray-100 active:bg-blue-100"
      >
        •
      </button>

      <!-- Insert Ordered List -->
      <button
        @click="insertList('ol')"
        title="Numbered List"
        class="mx-1 px-2.5 py-1 cursor-pointer border border-gray-300 bg-white rounded transition-colors hover:bg-gray-100 active:bg-blue-100"
      >
        1.
      </button>

      <!-- Add Image -->
      <button
        @click="insertImage"
        title="Insert Image"
        class="mx-1 px-2.5 py-1 cursor-pointer border border-gray-300 bg-white rounded transition-colors hover:bg-gray-100 active:bg-blue-100"
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
          class="w-16 p-1 border border-gray-300 bg-white rounded"
        />
        <button
          @click="setPageBreak"
          title="Set Page Break Height"
          class="px-2.5 py-1 cursor-pointer border border-gray-300 bg-white rounded transition-colors hover:bg-gray-100 active:bg-blue-100"
        >
          Set
        </button>
      </span>
    </div>

    <!-- Default editor value -->
    <div
      ref="editorRef"
      id="editor"
      class="editor border border-gray-300 min-h-72 p-5 mt-0 outline-none leading-6 focus:border-green-500 focus:shadow-[0_0_5px_rgba(76,175,80,0.3)]"
      contenteditable="true"
      @focus="handleEditorFocus"
      v-html="editorContent"
    />
  </div>
</template>

<style scoped>
/* Global styles for editor content */
.editor :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 10px 0;
  border: 1px solid #d1d5db;
}

.editor :deep(table td) {
  padding: 8px;
  border: 1px solid #d1d5db;
}

.editor :deep(ul),
.editor :deep(ol) {
  margin: 10px 0;
  padding-left: 32px;
}

/* Add these styles for list markers */
.editor :deep(ul) {
  list-style-type: disc;
}

.editor :deep(ol) {
  list-style-type: decimal;
}

.editor :deep(li) {
  display: list-item;
}

.editor :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 10px 0;
}
</style>
