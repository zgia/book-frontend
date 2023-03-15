export interface Book {
  id: number,
  title: string,
  author?: string,
  summary?: string,
  source?: string
}

export interface Chapter {
  id: number,
  volumeid?: number,
  title: string,
}

export interface Volume {
  id: number,
  bookid?: number,
  title: string,
  summary?: string,
}