export interface Book {
  id: number,
  categoryid?: string,
  title: string,
  author?: string,
  summary?: string,
  source?: string,
  cover?: string,
  wordcount?: number,
  done?: number,
  latestChapter?: string,
}

export interface Category {
  id: number,
  parentid: number,
  title: string,
  books?: number,
}

export interface Chapter {
  id: number,
  volumeid?: number,
  wordcount?: number,
  title: string,
}

export interface Volume {
  id: number,
  bookid?: number,
  title: string,
  summary?: string,
  cover?: string,
}

export interface SearchResult {
  bookId: number,
  author?: string,
  bookTitle: string,
  chaId: number,
  chaTitle: string,
  volId?: number,
  volTitle?: string,
  content: string,
}