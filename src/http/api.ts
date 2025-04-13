import { request, download } from './request'
import { sprintf } from 'sprintf-js'
import {
  UserInfo,
  Book,
  Volume,
  Chapter,
  Category,
  SearchResult,
  Author,
} from '~/models'

interface Params {
  id?: number
  bookid?: number
  rate?: number
  next?: number
  q?: string
}

export class SystemService {
  static async options() {
    return request<{
      categories: Category[]
      options: object
      pagesize: number
    }>('/options')
  }

  static async operator() {
    return request('/operator')
  }
}

export class UserService {
  static async dologin(params: object) {
    return request<{ token: string; user: UserInfo }>(
      '/auth/login',
      params,
      'post',
    )
  }

  static async userInfo() {
    return request<{ user: UserInfo }>('/auth/user')
  }

  static async changePassword(params: object) {
    return request('/auth/changepassword', params, 'post')
  }
}

export class BookService {
  static async download(params: Params, fileName = '') {
    return download(sprintf('/book/%u/download', params.id), {}, fileName)
  }

  static async search(params: Params) {
    return request<SearchResult[]>('/search', params)
  }

  static async finish(params: Params) {
    return request(sprintf('/book/%u/finish', params.id), params, 'post')
  }

  static async list(params: object) {
    return request<{ total: number; items: Book[] }>('/book/books', params)
  }

  static async booksSize() {
    return request<{ data_size: number; index_size: number }>(
      '/book/books/size',
    )
  }

  static async updateBook(params: Params) {
    return request<{ id: number }>(
      sprintf('/book/%u', params.id),
      params,
      'post',
    )
  }

  static async getBook(params: Params) {
    return request<Book>(sprintf('/book/%u', params.id))
  }

  static async deleteBook(params: Params) {
    return request(sprintf('/book/%u', params.id), params, 'delete')
  }

  static async rateBook(params: Params) {
    return request(sprintf('/book/%u', params.id), params, 'post')
  }

  static async getVolumes(params: Params) {
    return request<{ items: Volume[]; book: Book }>(
      sprintf('/book/%u/volumes', params.bookid),
    )
  }

  static async getVolume(params: Params) {
    return request<Volume>(
      sprintf('/book/%u/volume/%u', params.bookid, params.id),
    )
  }

  static async updateVolume(params: Params) {
    return request<{ id: number }>(
      sprintf('/book/%u/volume/%u', params.bookid, params.id),
      params,
      'post',
    )
  }

  static async deleteVolume(params: Params) {
    return request(
      sprintf('/book/%u/volume/%u', params.bookid, params.id),
      {},
      'delete',
    )
  }

  static async getChapters(params: Params) {
    return request<{
      book: Book
      volumes: Volume[]
      items: { string: never[] }
    }>(sprintf('/book/%u/chapters', params.bookid))
  }

  static async getChapter(params: Params) {
    return request<{
      prev: Chapter
      next: Chapter
      current: Chapter
      book: Book
    }>(sprintf('/book/%u/chapter/%u', params.bookid, params.id), params)
  }

  static async getVolumeChapters(params: Params) {
    return request<{ content: string }>(
      sprintf('/book/%u/volchapters/%u', params.bookid, params.id),
      params,
    )
  }

  static async updateChapter(params: Params) {
    return request(
      sprintf('/book/%u/chapter/%u', params.bookid, params.id),
      params,
      'post',
    )
  }

  static async deleteChapter(params: Params) {
    return request(
      sprintf('/book/%u/chapter/%u', params.bookid, params.id),
      {},
      'delete',
    )
  }
}

export class AuthorService {
  static async list(params: object) {
    return request<{ total: number; items: Author[] }>('/author/index', params)
  }

  static async updateAuthor(params: Params) {
    return request<{ id: number }>(
      sprintf('/author/%u', params.id),
      params,
      'post',
    )
  }

  static async getAuthor(params: Params) {
    return request<Author>(sprintf('/author/%u', params.id))
  }

  static async deleteAuthor(params: Params) {
    return request(sprintf('/author/%u', params.id), params, 'delete')
  }
}

export class ConfigService {
  static async list(params: object) {
    return request('/cnf/categories', params)
  }

  static async updateCategory(params: Params) {
    return request(sprintf('/cnf/category/%u', params.id), params, 'post')
  }

  static async deleteCategory(params: Params) {
    return request(sprintf('/cnf/category/%u', params.id), params, 'delete')
  }
}
