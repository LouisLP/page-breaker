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
      const position = DOMUtils.getElementPosition(item, this.referenceElement)

      if (position.bottom <= breakPosition) {
        // Item fits completely before the break
        beforeItems.push(item)
      } else {
        // Item goes after the break
        afterItems.push(item)
      }
    }

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

  /**
   * Split a text element by position (simple approach)
   */
  private splitTextElement(element: Element, breakPosition: number): SplitResult {
    // For simplicity, just move the entire element to one side or the other
    // In a production app, you'd implement word-by-word splitting
    const position = DOMUtils.getElementPosition(element, this.referenceElement)

    if (position.top >= breakPosition) {
      // Element is entirely after break point
      return { before: null, after: element.cloneNode(true) as Element }
    } else if (position.bottom <= breakPosition) {
      // Element is entirely before break point
      return { before: element.cloneNode(true) as Element, after: null }
    } else {
      // Element crosses break point - simplified handling
      return { before: element.cloneNode(true) as Element, after: null }
    }
  }

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
      const position = DOMUtils.getElementPosition(currentElement, this.referenceElement)

      // Check if element fits on current page
      if (currentPageHeight === 0 || currentPageHeight + position.height <= pageHeight) {
        // Element fits entirely
        currentPage.push(currentElement.cloneNode(true) as Element)
        currentPageHeight += position.height
        remainingElements.shift() // Remove processed element
      } else {
        // Element causes overflow - try to split
        if (currentElement.tagName === 'TABLE') {
          const { before, after } = this.splitTable(currentElement, pageHeight)

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
          const { before, after } = this.splitList(currentElement, pageHeight)

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
          // For other elements (images, text, etc.), move to next page
          // Create current page
          const pageDiv = document.createElement('div')
          currentPage.forEach((el) => pageDiv.appendChild(el))
          pages.push(pageDiv.innerHTML)

          // Reset for next page
          currentPage = []
          currentPageHeight = 0

          // Don't remove the element, it will be processed in the next iteration
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
