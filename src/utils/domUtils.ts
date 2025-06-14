/**
 * Utility functions for DOM manipulation and measurement
 */
export class DOMUtils {
  /**
   * Get element position information relative to a container
   */
  static getElementPosition(
    element: Element,
    container: Element,
  ): { top: number; bottom: number; height: number } {
    const containerRect = container.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()

    return {
      top: elementRect.top - containerRect.top,
      bottom: elementRect.bottom - containerRect.top,
      height: elementRect.height,
    }
  }

  /**
   * Clone a table structure properly preserving all attributes
   */
  static cloneTableStructure(table: Element): Element {
    // Create a fresh table element
    const clonedTable = document.createElement('table')

    // Copy all attributes from original table
    Array.from(table.attributes).forEach((attr) => {
      clonedTable.setAttribute(attr.name, attr.value)
    })

    // Find and clone the tbody
    const originalTbody = table.querySelector('tbody')
    if (originalTbody) {
      const clonedTbody = document.createElement('tbody')
      // Copy tbody attributes if any
      Array.from(originalTbody.attributes).forEach((attr) => {
        clonedTbody.setAttribute(attr.name, attr.value)
      })
      clonedTable.appendChild(clonedTbody)
    } else {
      // Create tbody if it doesn't exist
      clonedTable.appendChild(document.createElement('tbody'))
    }

    return clonedTable
  }

  /**
   * Create a table with specific rows
   */
  static createTableWithRows(originalTable: Element, rows: Element[]): Element {
    const newTable = this.cloneTableStructure(originalTable)
    const tbody = newTable.querySelector('tbody')!

    rows.forEach((row) => {
      const clonedRow = row.cloneNode(true) as Element
      tbody.appendChild(clonedRow)
    })

    return newTable
  }

  /**
   * Clone a list structure
   */
  static createListWithItems(originalList: Element, items: Element[]): Element {
    const newList = document.createElement(originalList.tagName)

    // Copy all attributes
    Array.from(originalList.attributes).forEach((attr) => {
      newList.setAttribute(attr.name, attr.value)
    })

    // Add items
    items.forEach((item) => {
      newList.appendChild(item.cloneNode(true))
    })

    return newList
  }
}
