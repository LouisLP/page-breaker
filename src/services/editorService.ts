/**
 * Service for handling rich text editor actions
 */
export class EditorService {
  /**
   * Apply text formatting
   */
  static formatText(command: 'bold' | 'italic' | 'underline'): void {
    document.execCommand(command, false, undefined)
  }

  /**
   * Insert a table at cursor position
   */
  static insertTable(): void {
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

  /**
   * Insert a list at cursor position
   */
  static insertList(type: 'ul' | 'ol'): void {
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

  /**
   * Insert an image at cursor position
   */
  static insertImage(): void {
    const imageUrl = prompt('Please enter the image URL:')
    if (imageUrl) {
      const img = `<img src="${imageUrl}" alt="Inserted image" style="max-width: 100%; height: auto;">`
      document.execCommand('insertHTML', false, img)
    }
  }

  /**
   * Handle editor focus events
   */
  static handleEditorFocus(editor: HTMLElement): void {
    if (editor.textContent === 'Start typing here...') {
      editor.textContent = ''
    }
  }
}
