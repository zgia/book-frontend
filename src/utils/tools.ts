
export const validateMobile = (rule: any, value: any, callback: any) => {
  if (!(/^1\d{10}$/.test(value))) {
    callback(new Error('需要填写手机号，比如：13901390139'))
  } else {
    callback()
  }
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
    return (isNaN(tmp) || !isFinite(tmp)) ? 0 : tmp
  } else if (type === 'number' && isFinite(mixedVar)) {
    return mixedVar < 0 ? Math.ceil(mixedVar) : Math.floor(mixedVar)
  } else {
    return 0
  }
}

export const nl2br = (str = '') => {
  if (typeof str === 'undefined' || str === null) {
    return '';
  }
  return '<p>' + (str + '').replace(/\r\n|\n\r|\r|\n/g, '</p><p>').replaceAll('<p></p>', '') + '</p>';
}

export const wc2Wan = (num = 0) => {
  return num >= 10000 ? Math.ceil(num / 10000) + '万' : num
}

export const getToken = () => {
  return localStorage.token
}

export const setToken = (token = '') => {
  if (!token) {
    localStorage.removeItem('token')
  } else {
    localStorage.token = token
  }
}

export const clearCaches = () => {
  const color = localStorage.vueuseColorScheme
  localStorage.clear()
  localStorage.vueuseColorScheme = color
}

export const setCaches = (token: string, user: any) => {
  setToken(token)

  localStorage.mobile = user.mobile
  localStorage.username = user.username
}

export const numCode = (seq: number) => {
  if (seq < 2) {
    return ''
  }

  const titles = [
    '⓪',
    '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩',
    '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳',
    '㉑', '㉒', '㉓', '㉔', '㉕', '㉖', '㉗', '㉘', '㉙', '㉚',
    '㉛', '㉜', '㉝', '㉞', '㉟', '㊱', '㊲', '㊳', '㊴', '㊵',
    '㊶', '㊷', '㊸', '㊹', '㊺', '㊻', '㊼', '㊽', '㊾', '㊿'
  ]

  return titles[seq]
}