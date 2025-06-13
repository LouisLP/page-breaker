export interface SplitResult {
  before: Element | null
  after: Element | null
}

export interface PageResult {
  pageElements: Element[]
  overflow: Element[]
}

export interface ElementInfo {
  element: Element
  top: number
  bottom: number
  height: number
  canSplit: boolean
}
