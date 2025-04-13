import { UAParser } from 'ua-parser-js'

const osinfo = new UAParser().getOS()

// 对话框宽度
export const defaultDialogWidth = 700
export const dialogWidth = (clientWidth: number) => {
  return clientWidth < defaultDialogWidth / 0.95
    ? clientWidth * 0.95
    : defaultDialogWidth
}

export const detectOS = () => {
  let os = 'Unknown'

  if (osinfo.name.indexOf('Win') !== -1) {
    os = 'Windows'
  } else if (osinfo.name.indexOf('Mac') !== -1) {
    os = 'MacOS'
  } else if (osinfo.name.indexOf('Android') !== -1) {
    os = 'Android'
  } else if (osinfo.name.indexOf('Linux') !== -1) {
    os = 'Linux'
  } else if (osinfo.name.indexOf('X11') !== -1) {
    os = 'UNIX'
  }

  return os
}

export const metaKey = () => {
  return detectOS() === 'MacOS' ? '⌘' : detectOS() === 'Windows' ? '⊞' : 'Meta'
}

export const altKey = () => {
  return detectOS() === 'MacOS' ? '⌥' : 'Alt'
}

export const searchShortcut = () => {
  return metaKey() + ' + K'
}

export const newbookShortcut = () => {
  return metaKey() + ' + B'
}

export const intval = (mixedVar, base = 10) => {
  //  discuss at: https://locutus.io/php/intval/
  // original by: Kevin van Zonneveld (https://kvz.io)
  // improved by: stensi
  // bugfixed by: Kevin van Zonneveld (https://kvz.io)
  // bugfixed by: Brett Zamir (https://brett-zamir.me)
  // bugfixed by: Rafał Kukawski (https://blog.kukawski.pl)
  //    input by: Matteo
  //   example 1: intval('Kevin van Zonneveld')
  //   returns 1: 0
  //   example 2: intval(4.2)
  //   returns 2: 4
  //   example 3: intval(42, 8)
  //   returns 3: 42
  //   example 4: intval('09')
  //   returns 4: 9
  //   example 5: intval('1e', 16)
  //   returns 5: 30
  //   example 6: intval(0x200000001)
  //   returns 6: 8589934593
  //   example 7: intval('0xff', 0)
  //   returns 7: 255
  //   example 8: intval('010', 0)
  //   returns 8: 8
  let tmp, match
  const type = typeof mixedVar
  if (type === 'boolean') {
    return +mixedVar
  } else if (type === 'string') {
    if (base === 0) {
      match = mixedVar.match(/^\s*0(x?)/i)
      base = match ? (match[1] ? 16 : 8) : 10
    }
    tmp = parseInt(mixedVar, base || 10)
    return isNaN(tmp) || !isFinite(tmp) ? 0 : tmp
  } else if (type === 'number' && isFinite(mixedVar)) {
    return mixedVar < 0 ? Math.ceil(mixedVar) : Math.floor(mixedVar)
  } else {
    return 0
  }
}

export const isEmpty = (val) => {
  try {
    if (
      typeof val === 'undefined' ||
      val === null ||
      val === '' ||
      val === 0 ||
      (Array.isArray(val) && val.length === 0)
    ) {
      return true
    }

    // 空对象
    if (
      Object.prototype.toString.call(val) === '[object Object]' &&
      Object.keys(val).length === 0
    ) {
      return true
    }
  } catch {
    return true
  }

  return false
}

/**
 * 返回一个新对象，去掉所有“空值”属性
 * @param {Object} obj
 * @returns {Object}
 */
export const cleanShallow = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj

  return Object.entries(obj).reduce((acc, [key, val]) => {
    if (!isEmpty(val)) {
      acc[key] = val
    }
    return acc
  }, {})
}

export const nl2br = (str = '') => {
  if (isEmpty(str)) {
    return ''
  }
  return (
    '<p>' +
    (str + '')
      .replace(/\r\n|\n\r|\r|\n/g, '</p><p>')
      .replaceAll('<p></p>', '') +
    '</p>'
  )
}

export const getToken = () => {
  return localStorage.getItem('token')
}

export const setToken = (token = '') => {
  if (!token) {
    localStorage.removeItem('token')
  } else {
    localStorage.setItem('token', token)
  }
}

export const clearCaches = () => {
  const items = [
    'topage',
    'reqtoken',
    'language',
    'token',
    'mobile',
    'username',
  ]

  items.forEach((item) => {
    localStorage.removeItem(item)
  })
}

export const setCaches = (token: string, user: any) => {
  setToken(token)

  localStorage.setItem('mobile', user.mobile)
  localStorage.setItem('username', user.username)
}

export const numCode = (seq: number) => {
  if (seq < 2) {
    return ''
  }

  const titles = [
    '⓪',
    '①',
    '②',
    '③',
    '④',
    '⑤',
    '⑥',
    '⑦',
    '⑧',
    '⑨',
    '⑩',
    '⑪',
    '⑫',
    '⑬',
    '⑭',
    '⑮',
    '⑯',
    '⑰',
    '⑱',
    '⑲',
    '⑳',
    '㉑',
    '㉒',
    '㉓',
    '㉔',
    '㉕',
    '㉖',
    '㉗',
    '㉘',
    '㉙',
    '㉚',
    '㉛',
    '㉜',
    '㉝',
    '㉞',
    '㉟',
    '㊱',
    '㊲',
    '㊳',
    '㊴',
    '㊵',
    '㊶',
    '㊷',
    '㊸',
    '㊹',
    '㊺',
    '㊻',
    '㊼',
    '㊽',
    '㊾',
    '㊿',
  ]

  return titles[seq]
}

export * from './tap-swipe'
