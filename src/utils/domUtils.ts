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
   * Clone a table structure without content
   */
  static cloneTableStructure(table: Element): Element {
    const clonedTable = table.cloneNode(false) as Element
    const tbody = clonedTable.querySelector('tbody') || document.createElement('tbody')
    if (!clonedTable.querySelector('tbody')) {
      clonedTable.appendChild(tbody)
    }
    return clonedTable
  }

  /**
   * Add rows to a table's tbody
   */
  static addRowsToTable(table: Element, rows: Element[]): void {
    const tbody = table.querySelector('tbody')!
    rows.forEach((row) => tbody.appendChild(row.cloneNode(true)))
  }
}
