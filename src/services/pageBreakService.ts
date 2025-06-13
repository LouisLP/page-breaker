import type { SplitResult, PageResult } from '@/types/editor'
import { DOMUtils } from '@/utils/domUtils'

/**
 * Service for handling page break logic and content splitting
 */
export class PageBreakService {
  private referenceElement: HTMLElement

  constructor(referenceElement: HTMLElement) {
    this.referenceElement = referenceElement
  }

  /**
   * Split a table by rows based on available height
   */
  private splitTable(table: Element, availableHeight: number): SplitResult {
    const rows = Array.from(table.querySelectorAll('tr'))
    const beforeRows: Element[] = []
    let afterRows: Element[] = []

    for (let i = 0; i < rows.length; i++) {
      const testRows = [...beforeRows, rows[i]]
      const testTable = DOMUtils.cloneTableStructure(table)
      DOMUtils.addRowsToTable(testTable, testRows)

      const testHeight = DOMUtils.measureElementsHeight([testTable], this.referenceElement)

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
      beforeTable = DOMUtils.cloneTableStructure(table)
      DOMUtils.addRowsToTable(beforeTable, beforeRows)
    }

    if (afterRows.length > 0) {
      afterTable = DOMUtils.cloneTableStructure(table)
      DOMUtils.addRowsToTable(afterTable, afterRows)
    }

    return { before: beforeTable, after: afterTable }
  }

  /**
   * Split a list by items based on available height
   */
  private splitList(list: Element, availableHeight: number): SplitResult {
    const items = Array.from(list.children)
    const beforeItems: Element[] = []
    let afterItems: Element[] = []

    for (let i = 0; i < items.length; i++) {
      const testItems = [...beforeItems, items[i]]
      const testList = list.cloneNode(false) as Element
      testItems.forEach((item) => testList.appendChild(item.cloneNode(true)))

      const testHeight = DOMUtils.measureElementsHeight([testList], this.referenceElement)

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

  /**
   * Split a text element by words based on available height
   */
  private splitTextElement(element: Element, availableHeight: number): SplitResult {
    const text = element.textContent || ''
    const words = text.split(' ')

    const beforeWords: string[] = []
    let afterWords: string[] = []

    for (let i = 0; i < words.length; i++) {
      const testWords = [...beforeWords, words[i]]
      const testElement = element.cloneNode(false) as Element
      testElement.textContent = testWords.join(' ')

      const testHeight = DOMUtils.measureElementsHeight([testElement], this.referenceElement)

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

  /**
   * Create a single page from elements array
   */
  private createSinglePage(elements: Element[], pageHeight: number): PageResult {
    const pageElements: Element[] = []
    let overflow: Element[] = []

    for (let i = 0; i < elements.length; i++) {
      const currentElement = elements[i]
      const testElements = [...pageElements, currentElement]
      const testHeight = DOMUtils.measureElementsHeight(testElements, this.referenceElement)

      if (testHeight <= pageHeight) {
        // Element fits completely
        pageElements.push(currentElement.cloneNode(true) as Element)
      } else {
        // Element causes overflow
        const availableHeight =
          pageHeight - DOMUtils.measureElementsHeight(pageElements, this.referenceElement)

        // Try to split the element
        if (currentElement.tagName === 'TABLE') {
          const { before, after } = this.splitTable(currentElement, availableHeight)

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
          const { before, after } = this.splitList(currentElement, availableHeight)

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
          const { before, after } = this.splitTextElement(currentElement, availableHeight)

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

  /**
   * Process elements and create pages
   */
  public processElements(elements: Element[], pageHeight: number): string[] {
    if (elements.length === 0) return []

    const pages: string[] = []
    let remainingElements = [...elements]

    while (remainingElements.length > 0) {
      const { pageElements, overflow } = this.createSinglePage(remainingElements, pageHeight)

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
}
