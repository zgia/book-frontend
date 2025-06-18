export interface Book {
  id: number
  categoryid?: number | string
  title: string
  alias?: string
  author?: string
  author_former_name?: string
  summary?: string
  source?: string
  cover?: string
  wordcount?: number
  isfinished?: number
  latest?: string
  rate?: number
}

export interface Category {
  id: number
  parentid: number
  title: string
  bookcount?: number
}

export interface Chapter {
  id: number
  title: string
  volumeid?: number | string
  wordcount?: number
  content?: string
}

export interface Volume {
  id: number
  bookid?: number
  title: string
  summary?: string
  cover?: string
}

export interface SearchResult {
  bookId: number
  author?: string
  bookTitle: string
  chaId: number
  chaTitle: string
  volId?: number
  volTitle?: string
  content: string
}

export interface Author {
  id: number
  name: string
  former_name?: string
  books?: []
}
