import { request, download } from './request'
import { sprintf } from 'sprintf-js'

export class SystemService {
  static async globalOptions() {
    return request('/globaloptions')
  }

  static async operator() {
    return request('/operator')
  }
}

export class UserService {
  static async dologin(params: {}) {
    return request('/auth/login', params, 'post')
  }

  static async isLogined() {
    return request('/auth/islogined')
  }

  static async changePassword(params: {}) {
    return request('/auth/changepassword', params, 'post')
  }
}

export class BookService {
  static async download(params: {}, fileName = '') {
    return download(sprintf('/book/%u/download', params.id), {}, fileName)
  }

  static async list(params: {}) {
    return request('/book/books', params)
  }

  static async updateBook(params: {}) {
    return request(sprintf('/book/%u', params.id), params, 'post')
  }

  static async getBook(params: {}) {
    return request(sprintf('/book/%u', params.id))
  }

  static async deleteBook(params: {}) {
    return request(sprintf('/book/%u', params.id), params, 'delete')
  }

  static async getVolumes(params: {}) {
    return request(sprintf('/book/%u/volumes', params.bookid))
  }

  static async updateVolume(params: {}) {
    return request(sprintf('/book/%u/volume/%u', params.bookid, params.id), params, 'post')
  }

  static async deleteVolume(params: {}) {
    return request(sprintf('/book/%u/volume/%u', params.bookid, params.id), {}, 'delete')
  }

  static async getChapters(params: {}) {
    return request(sprintf('/book/%u/chapters', params.bookid))
  }

  static async getChapter(params: {}) {
    return request(sprintf('/book/%u/chapter/%u', params.bookid, params.id), params)
  }

  static async updateChapter(params: {}) {
    return request(sprintf('/book/%u/chapter/%u', params.bookid, params.id), params, 'post')
  }

  static async deleteChapter(params: {}) {
    return request(sprintf('/book/%u/chapter/%u', params.bookid, params.id), {}, 'delete')
  }
}
