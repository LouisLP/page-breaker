import type { SplitResult } from '@/types/editor'
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
   * Split a table by rows based on page break position
   */
  private splitTable(table: Element, breakPosition: number): SplitResult {
    const rows = Array.from(table.querySelectorAll('tr'))
    const beforeRows: Element[] = []
    const afterRows: Element[] = []

    for (const row of rows) {
      const position = DOMUtils.getElementPosition(row, this.referenceElement)

      if (position.bottom <= breakPosition) {
        // Row fits completely before the break
        beforeRows.push(row)
      } else {
        // Row goes after the break
        afterRows.push(row)
      }
    }

    let beforeTable: Element | null = null
    let afterTable: Element | null = null

    if (beforeRows.length > 0) {
      beforeTable = DOMUtils.createTableWithRows(table, beforeRows)
    }

    if (afterRows.length > 0) {
      afterTable = DOMUtils.createTableWithRows(table, afterRows)
    }

    return { before: beforeTable, after: afterTable }
  }

  /**
   * Split a list by items based on page break position
   */
  private splitList(list: Element, breakPosition: number): SplitResult {
    const items = Array.from(list.children)
    const beforeItems: Element[] = []
    const afterItems: Element[] = []

    for (const item of items) {
      // Get the position relative to the viewport
      const itemRect = item.getBoundingClientRect()
      // Convert to position relative to the editor
      const editorRect = this.referenceElement.getBoundingClientRect()
      const relativeTop = itemRect.top - editorRect.top
      const relativeBottom = itemRect.bottom - editorRect.top

      console.log(
        'List item:',
        item.textContent?.trim(),
        'position:',
        relativeTop,
        'to',
        relativeBottom,
        'break at:',
        breakPosition,
      )

      if (relativeBottom <= breakPosition) {
        // Item fits completely before the break
        beforeItems.push(item)
      } else {
        // Item goes after the break
        afterItems.push(item)
      }
    }

    console.log(
      `List split: ${beforeItems.length} items before, ${afterItems.length} items after break`,
    )

    let beforeList: Element | null = null
    let afterList: Element | null = null

    if (beforeItems.length > 0) {
      beforeList = DOMUtils.createListWithItems(list, beforeItems)
    }

    if (afterItems.length > 0) {
      afterList = DOMUtils.createListWithItems(list, afterItems)
    }

    return { before: beforeList, after: afterList }
  }

  // TODO: better text implementation
  // /**
  //  * Split a text element by position (simple approach)
  //  */
  // private splitTextElement(element: Element, breakPosition: number): SplitResult {
  //   // For simplicity, just move the entire element to one side or the other
  //   // In a production app, you'd implement word-by-word splitting
  //   const position = DOMUtils.getElementPosition(element, this.referenceElement)

  //   if (position.top >= breakPosition) {
  //     // Element is entirely after break point
  //     return { before: null, after: element.cloneNode(true) as Element }
  //   } else if (position.bottom <= breakPosition) {
  //     // Element is entirely before break point
  //     return { before: element.cloneNode(true) as Element, after: null }
  //   } else {
  //     // Element crosses break point - simplified handling
  //     return { before: element.cloneNode(true) as Element, after: null }
  //   }
  // }

  /**
   * Process elements and create pages
   */
  public processElements(elements: Element[], pageHeight: number): string[] {
    if (elements.length === 0) return []

    const pages: string[] = []
    let currentPage: Element[] = []
    let currentPageHeight = 0
    const remainingElements = [...elements]

    while (remainingElements.length > 0) {
      const currentElement = remainingElements[0]
      const elementRect = currentElement.getBoundingClientRect()
      const editorRect = this.referenceElement.getBoundingClientRect()
      const elementHeight = elementRect.height

      // FIXME: debugging logs
      console.debug(
        'Processing element:',
        currentElement.tagName,
        'Height:',
        elementHeight,
        'Current page height:',
        currentPageHeight,
        'Page limit:',
        pageHeight,
      )

      // Check if element fits on current page
      if (currentPageHeight === 0 || currentPageHeight + elementHeight <= pageHeight) {
        // Element fits entirely
        currentPage.push(currentElement.cloneNode(true) as Element)
        currentPageHeight += elementHeight
        remainingElements.shift() // Remove processed element
      } else {
        // Calculate where in the editor the page break occurs
        const breakPosition =
          pageHeight -
          currentPageHeight +
          (currentElement.getBoundingClientRect().top - editorRect.top)
        console.log('Break position calculated:', breakPosition)

        // Element causes overflow - try to split
        if (currentElement.tagName === 'TABLE') {
          const { before, after } = this.splitTable(currentElement, breakPosition)

          if (before) {
            currentPage.push(before)
          }

          // Create current page
          const pageDiv = document.createElement('div')
          currentPage.forEach((el) => pageDiv.appendChild(el))
          pages.push(pageDiv.innerHTML)

          // Reset for next page
          currentPage = []
          currentPageHeight = 0

          // Update remaining elements
          remainingElements.shift() // Remove the table
          if (after) {
            remainingElements.unshift(after) // Add split table remainder
          }
        } else if (currentElement.tagName === 'UL' || currentElement.tagName === 'OL') {
          // Similar calc as tables
          const { before, after } = this.splitList(currentElement, breakPosition)

          if (before) {
            currentPage.push(before)
          }

          // Create current page
          const pageDiv = document.createElement('div')
          currentPage.forEach((el) => pageDiv.appendChild(el))
          pages.push(pageDiv.innerHTML)

          // Reset for next page
          currentPage = []
          currentPageHeight = 0

          // Update remaining elements
          remainingElements.shift() // Remove the list
          if (after) {
            remainingElements.unshift(after) // Add split list remainder
          }
        } else {
          // All other elements just get fully moved to the next page
          const pageDiv = document.createElement('div')
          currentPage.forEach((el) => pageDiv.appendChild(el))
          pages.push(pageDiv.innerHTML)

          // Reset for next page
          currentPage = []
          currentPageHeight = 0

          // Don't remove the element (processed in the next iteration)
        }
      }

      // Check if we need to finalize the last page
      if (remainingElements.length === 0 && currentPage.length > 0) {
        const pageDiv = document.createElement('div')
        currentPage.forEach((el) => pageDiv.appendChild(el))
        pages.push(pageDiv.innerHTML)
      }
    }

    return pages
  }
}
