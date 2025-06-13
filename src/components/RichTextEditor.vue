<script setup lang="ts">
import { ref } from 'vue'

const pageHeight = ref<number>(1000)
const editorRef = ref<HTMLElement | null>(null)
const pages = ref<string[]>([])
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

// Create a temporary container to accurately measure element heights
const createMeasurementContainer = (): HTMLElement => {
  const container = document.createElement('div')
  const editorStyles = window.getComputedStyle(editorRef.value!)

  container.style.position = 'absolute'
  container.style.visibility = 'hidden'
  container.style.top = '-9999px'
  container.style.left = '-9999px'
  container.style.width = editorStyles.width
  container.style.padding = editorStyles.padding
  container.style.margin = editorStyles.margin
  container.style.fontFamily = editorStyles.fontFamily
  container.style.fontSize = editorStyles.fontSize
  container.style.lineHeight = editorStyles.lineHeight

  document.body.appendChild(container)
  return container
}

const measureElementsHeight = (elements: Element[]): number => {
  const container = createMeasurementContainer()

  elements.forEach((el) => {
    container.appendChild(el.cloneNode(true))
  })

  const height = container.offsetHeight
  document.body.removeChild(container)
  return height
}

const splitTable = (
  table: Element,
  availableHeight: number,
): { before: Element | null; after: Element | null } => {
  const rows = Array.from(table.querySelectorAll('tr'))
  const beforeRows: Element[] = []
  let afterRows: Element[] = []

  for (let i = 0; i < rows.length; i++) {
    const testRows = [...beforeRows, rows[i]]
    const testTable = table.cloneNode(false) as Element
    const tbody = testTable.querySelector('tbody') || document.createElement('tbody')
    if (!testTable.querySelector('tbody')) {
      testTable.appendChild(tbody)
    }
    testRows.forEach((row) => tbody.appendChild(row.cloneNode(true)))

    const testHeight = measureElementsHeight([testTable])

    if (testHeight <= availableHeight) {
      beforeRows.push(rows[i])
    } else {
      afterRows = rows.slice(i)
      break
    }
  }

  let beforeTable: Element | null = null
  let afterTable: Element | null = null

  if (beforeRows.length > 0) {
    beforeTable = table.cloneNode(false) as Element
    const tbody = beforeTable.querySelector('tbody') || document.createElement('tbody')
    if (!beforeTable.querySelector('tbody')) {
      beforeTable.appendChild(tbody)
    }
    beforeRows.forEach((row) => tbody.appendChild(row.cloneNode(true)))
  }

  if (afterRows.length > 0) {
    afterTable = table.cloneNode(false) as Element
    const tbody = afterTable.querySelector('tbody') || document.createElement('tbody')
    if (!afterTable.querySelector('tbody')) {
      afterTable.appendChild(tbody)
    }
    afterRows.forEach((row) => tbody.appendChild(row.cloneNode(true)))
  }

  return { before: beforeTable, after: afterTable }
}

const splitList = (
  list: Element,
  availableHeight: number,
): { before: Element | null; after: Element | null } => {
  const items = Array.from(list.children)
  const beforeItems: Element[] = []
  let afterItems: Element[] = []

  for (let i = 0; i < items.length; i++) {
    const testItems = [...beforeItems, items[i]]
    const testList = list.cloneNode(false) as Element
    testItems.forEach((item) => testList.appendChild(item.cloneNode(true)))

    const testHeight = measureElementsHeight([testList])

    if (testHeight <= availableHeight) {
      beforeItems.push(items[i])
    } else {
      afterItems = items.slice(i)
      break
    }
  }

  let beforeList: Element | null = null
  let afterList: Element | null = null

  if (beforeItems.length > 0) {
    beforeList = list.cloneNode(false) as Element
    beforeItems.forEach((item) => beforeList!.appendChild(item.cloneNode(true)))
  }

  if (afterItems.length > 0) {
    afterList = list.cloneNode(false) as Element
    afterItems.forEach((item) => afterList!.appendChild(item.cloneNode(true)))
  }

  return { before: beforeList, after: afterList }
}

const splitTextElement = (
  element: Element,
  availableHeight: number,
): { before: Element | null; after: Element | null } => {
  const text = element.textContent || ''
  const words = text.split(' ')

  const beforeWords: string[] = []
  let afterWords: string[] = []

  for (let i = 0; i < words.length; i++) {
    const testWords = [...beforeWords, words[i]]
    const testElement = element.cloneNode(false) as Element
    testElement.textContent = testWords.join(' ')

    const testHeight = measureElementsHeight([testElement])

    if (testHeight <= availableHeight) {
      beforeWords.push(words[i])
    } else {
      afterWords = words.slice(i)
      break
    }
  }

  let beforeElement: Element | null = null
  let afterElement: Element | null = null

  if (beforeWords.length > 0) {
    beforeElement = element.cloneNode(false) as Element
    beforeElement.textContent = beforeWords.join(' ')
  }

  if (afterWords.length > 0) {
    afterElement = element.cloneNode(false) as Element
    afterElement.textContent = afterWords.join(' ')
  }

  return { before: beforeElement, after: afterElement }
}

const processElements = (elements: Element[]): string[] => {
  if (elements.length === 0) return []

  const pages: string[] = []
  let remainingElements = [...elements]

  while (remainingElements.length > 0) {
    const { pageElements, overflow } = createSinglePage(remainingElements)

    if (pageElements.length > 0) {
      const pageDiv = document.createElement('div')
      pageElements.forEach((el) => pageDiv.appendChild(el.cloneNode(true)))
      pages.push(pageDiv.innerHTML)
    }

    remainingElements = overflow

    // Prevent infinite loop
    if (pageElements.length === 0 && overflow.length > 0) {
      console.warn('Unable to fit element on page, skipping...')
      remainingElements = remainingElements.slice(1)
    }
  }

  return pages
}

const createSinglePage = (
  elements: Element[],
): { pageElements: Element[]; overflow: Element[] } => {
  const pageElements: Element[] = []
  let overflow: Element[] = []

  for (let i = 0; i < elements.length; i++) {
    const currentElement = elements[i]
    const testElements = [...pageElements, currentElement]
    const testHeight = measureElementsHeight(testElements)

    if (testHeight <= pageHeight.value) {
      // Element fits completely
      pageElements.push(currentElement.cloneNode(true) as Element)
    } else {
      // Element causes overflow
      const availableHeight = pageHeight.value - measureElementsHeight(pageElements)

      // Try to split the element
      if (currentElement.tagName === 'TABLE') {
        const { before, after } = splitTable(currentElement, availableHeight)

        if (before) {
          pageElements.push(before)
        }

        if (after) {
          overflow = [after, ...elements.slice(i + 1)]
        } else {
          overflow = elements.slice(i + 1)
        }
        break
      } else if (currentElement.tagName === 'UL' || currentElement.tagName === 'OL') {
        const { before, after } = splitList(currentElement, availableHeight)

        if (before) {
          pageElements.push(before)
        }

        if (after) {
          overflow = [after, ...elements.slice(i + 1)]
        } else {
          overflow = elements.slice(i + 1)
        }
        break
      } else if (currentElement.tagName === 'DIV' && currentElement.textContent?.trim()) {
        const { before, after } = splitTextElement(currentElement, availableHeight)

        if (before) {
          pageElements.push(before)
        }

        if (after) {
          overflow = [after, ...elements.slice(i + 1)]
        } else {
          overflow = elements.slice(i + 1)
        }
        break
      } else {
        // Non-splittable element (like images) - move to next page
        overflow = elements.slice(i)
        break
      }
    }
  }

  return { pageElements, overflow }
}

const setPageBreak = (): void => {
  if (!editorRef.value) return

  console.log(`Creating pages with height limit: ${pageHeight.value}px`)

  const editor = editorRef.value
  const elements = Array.from(editor.children)

  const resultPages = processElements(elements)
  pages.value = resultPages

  console.log(`Created ${resultPages.length} pages`)
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

    <!-- Editor or Pages View -->
    <div v-if="pages.length === 0">
      <!-- Default editor value -->
      <div
        ref="editorRef"
        id="editor"
        class="editor border border-gray-300 min-h-72 p-5 mt-0 outline-none leading-6 focus:border-blue-500 focus:shadow-sm"
        contenteditable="true"
        @focus="handleEditorFocus"
        v-html="editorContent"
      />
    </div>

    <div v-else>
      <!-- Pages View -->
      <div class="mb-4 flex items-center gap-2">
        <span class="text-sm text-gray-600"
          >{{ pages.length }} page{{ pages.length !== 1 ? 's' : '' }} created</span
        >
        <button
          @click="pages = []"
          class="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back to Editor
        </button>
      </div>

      <div
        v-for="(page, index) in pages"
        :key="index"
        class="page border border-gray-300 p-5 mb-4 bg-white shadow-sm"
        :style="{ height: pageHeight + 'px', overflow: 'hidden' }"
      >
        <div class="text-xs text-gray-500 mb-2">Page {{ index + 1 }}</div>
        <div v-html="page" class="page-content"></div>
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
