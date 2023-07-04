import { request, download } from './request'
import { sprintf } from 'sprintf-js'

interface Params {
  id?: number,
  bookid?: number
}

export class SystemService {
  static async globalOptions() {
    return request('/globaloptions')
  }

  static async operator() {
    return request('/operator')
  }
}

export class UserService {
  static async dologin(params: object) {
    return request('/auth/login', params, 'post')
  }

  static async isLogined() {
    return request('/auth/islogined')
  }

  static async changePassword(params: object) {
    return request('/auth/changepassword', params, 'post')
  }
}

export class BookService {
  static async download(params: Params, fileName = '') {
    return download(sprintf('/book/%u/download', params.id), {}, fileName)
  }

  static async list(params: object) {
    return request('/book/books', params)
  }

  static async updateBook(params: Params) {
    return request(sprintf('/book/%u', params.id), params, 'post')
  }

  static async getBook(params: Params) {
    return request(sprintf('/book/%u', params.id))
  }

  static async deleteBook(params: Params) {
    return request(sprintf('/book/%u', params.id), params, 'delete')
  }

  static async getVolumes(params: Params) {
    return request(sprintf('/book/%u/volumes', params.bookid))
  }

  static async updateVolume(params: Params) {
    return request(sprintf('/book/%u/volume/%u', params.bookid, params.id), params, 'post')
  }

  static async deleteVolume(params: Params) {
    return request(sprintf('/book/%u/volume/%u', params.bookid, params.id), {}, 'delete')
  }

  static async getChapters(params: Params) {
    return request(sprintf('/book/%u/chapters', params.bookid))
  }

  static async getChapter(params: Params) {
    return request(sprintf('/book/%u/chapter/%u', params.bookid, params.id), params)
  }

  static async updateChapter(params: Params) {
    return request(sprintf('/book/%u/chapter/%u', params.bookid, params.id), params, 'post')
  }

  static async deleteChapter(params: Params) {
    return request(sprintf('/book/%u/chapter/%u', params.bookid, params.id), {}, 'delete')
  }
}
