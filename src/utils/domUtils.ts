/**
 * Utility functions for DOM manipulation and measurement
 */
export class DOMUtils {
  /**
   * Create a temporary container to accurately measure element heights
   */
  static createMeasurementContainer(referenceElement: HTMLElement): HTMLElement {
    const container = document.createElement('div')
    const editorStyles = window.getComputedStyle(referenceElement)

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

  /**
   * Measure the height of elements in a temporary container
   */
  static measureElementsHeight(elements: Element[], referenceElement: HTMLElement): number {
    const container = this.createMeasurementContainer(referenceElement)

    elements.forEach((el) => {
      container.appendChild(el.cloneNode(true))
    })

    const height = container.offsetHeight
    document.body.removeChild(container)
    return height
  }

  /**
   * Clone a table structure properly preserving all attributes and nested structure
   */
  static cloneTableStructure(table: Element): Element {
    // Clone the table element with all its attributes
    const clonedTable = document.createElement('table')

    // Copy all attributes from original table
    for (let i = 0; i < table.attributes.length; i++) {
      const attr = table.attributes[i]
      clonedTable.setAttribute(attr.name, attr.value)
    }

    // Find and clone the tbody structure
    const originalTbody = table.querySelector('tbody')
    if (originalTbody) {
      const clonedTbody = document.createElement('tbody')
      // Copy tbody attributes if any
      for (let i = 0; i < originalTbody.attributes.length; i++) {
        const attr = originalTbody.attributes[i]
        clonedTbody.setAttribute(attr.name, attr.value)
      }
      clonedTable.appendChild(clonedTbody)
    } else {
      // Create tbody if it doesn't exist
      const tbody = document.createElement('tbody')
      clonedTable.appendChild(tbody)
    }

    return clonedTable
  }

  /**
   * Add rows to a table's tbody properly
   */
  static addRowsToTable(table: Element, rows: Element[]): void {
    const tbody = table.querySelector('tbody')
    if (!tbody) {
      console.error('No tbody found in table')
      return
    }

    rows.forEach((row) => {
      // Clone the entire row with all its content and attributes
      const clonedRow = row.cloneNode(true) as Element
      tbody.appendChild(clonedRow)
    })
  }

  /**
   * Create a complete table with specific rows (safer method)
   */
  static createTableWithRows(originalTable: Element, rows: Element[]): Element {
    const newTable = this.cloneTableStructure(originalTable)
    this.addRowsToTable(newTable, rows)
    return newTable
  }
}
