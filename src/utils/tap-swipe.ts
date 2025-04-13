import {
  IconoirFastArrowRight,
  IconoirFastArrowLeft,
  IconoirNavArrowRight,
  IconoirNavArrowLeft,
} from '~/composables'

// Tap 点击提示
export const showFlipping = ref(false)
export const flippingIcon = shallowRef(IconoirNavArrowLeft)

// Tap 翻页
const hw = document.body.clientWidth / 2
const qw = document.body.clientWidth / 8
// Tap 坐标点
let tapX = 0
let tapY = 0
// 2次点击的时间
const tapTimeout = 1000
const tapTimes = { start: 0, end: 0 }
// 用于处理2次Tap左右距离过远的问题
const tapDistance = 20
const tapCoords = { startX: 0, endX: 0, startY: 0, endY: 0 }

// 处理左右滑动
let isSwiping = false
let direction = ''
// 是否斜着滑动
let swipeSlope = false
// 滑动最小距离
const swipeDistance = 150

// 清除点击标记
const clearTap = () => {
  tapTimes.start = tapTimes.end = 0
  tapCoords.startX = tapCoords.endX = tapCoords.startY = tapCoords.endY = 0

  showFlipping.value = false
}

// 左侧3/4区域
const isLeftArea = (coord: number) => {
  return coord < hw - qw
}
// 右侧3/4区域
const isRightArea = (coord: number) => {
  return coord > hw + qw
}

const tapped = (coord: number, onFlip: (d: string) => void) => {
  let ok = false
  let direction = ''

  // 查看新章节
  // 点击右半边3/4区域，等同向左滑动
  if (isRightArea(coord)) {
    ok = true
    flippingIcon.value = IconoirFastArrowRight

    direction = 'left'
  }
  // 查看旧章节
  // 点击左半边3/4区域，等同向右滑动
  else if (isLeftArea(coord)) {
    ok = true
    flippingIcon.value = IconoirFastArrowLeft

    direction = 'right'
  } else {
    ok = false
    direction = ''
  }

  if (ok) {
    // 翻页后，延迟半秒隐藏指示图标
    setTimeout(clearTap, 500)
    onFlip(direction)
  } else {
    clearTap()
  }
}

// 左右滑动翻页
export const handleTouchStart = (e: TouchEvent) => {
  isSwiping = false
  direction = ''
  swipeSlope = false

  tapX = e.touches[0].clientX
  tapY = e.touches[0].clientY

  const dn = Date.now()

  // 防止2次点击时间间隔过长
  if (tapTimes.start && !tapTimes.end && dn - tapTimes.start > tapTimeout) {
    tapTimes.start = dn
    tapTimes.end = 0

    tapCoords.startX = tapX
    tapCoords.startY = tapY
    tapCoords.endX = 0
    tapCoords.endY = 0
  } else if (tapTimes.end) {
    // 一般来说，只有BUG才会到这里
    clearTap()
  } else {
    // 表示第2次点击
    if (tapTimes.start) {
      tapTimes.end = dn
    }
    // 表示第1次点击
    if (!tapTimes.start) {
      tapTimes.start = dn
    }

    if (tapCoords.startX) {
      tapCoords.endX = tapX
      tapCoords.endY = tapY
    }
    if (!tapCoords.startX) {
      tapCoords.startX = tapX
      tapCoords.startY = tapY
    }
  }
}

export const handleTouchMove = (e: TouchEvent) => {
  // 滑动后便清除点击操作
  clearTap()

  isSwiping = true

  // 是否斜着滑动
  swipeSlope = Math.abs(e.touches[0].clientY - tapY) > 10

  const swipeX = e.touches[0].clientX

  // 查看旧章节：往右滑 |-->
  if (swipeX - tapX >= swipeDistance) {
    direction = 'right'
  }
  // 查看新章节：往左滑 <--|
  else if (tapX - swipeX >= swipeDistance) {
    direction = 'left'
  } else {
    direction = ''
  }
}

export const handleTouchEnd = (onFlip: (d: string) => void) => {
  if (swipeSlope) {
    return
  }

  if (isSwiping) {
    if (direction) {
      onFlip(direction)
    }

    return
  }

  // 显示图标提示：>、>>
  if (tapTimes.start && !tapTimes.end) {
    if (isRightArea(tapX)) {
      flippingIcon.value = IconoirNavArrowRight

      showFlipping.value = true
    } else if (isLeftArea(tapX)) {
      flippingIcon.value = IconoirNavArrowLeft

      showFlipping.value = true
    } else {
      showFlipping.value = false
    }
  }

  if (!tapTimes.end) {
    return
  }

  // 双击应该在同一位置
  if (
    tapTimes.end - tapTimes.start > tapTimeout ||
    Math.abs(tapCoords.startX - tapCoords.endX) > tapDistance ||
    Math.abs(tapCoords.startY - tapCoords.endY) > tapDistance
  ) {
    clearTap()
    return
  }

  tapped(tapX, onFlip)
}

export const handleDoubleClick = (
  e: MouseEvent,
  onFlip: (d: string) => void,
) => {
  tapped(e.pageX, onFlip)

  // const t = `
  //   Offset X/Y: ${e.offsetX}, ${e.offsetY}
  //   Viewport X/Y: ${e.clientX}, ${e.clientY}
  //   Page X/Y: ${e.pageX}, ${e.pageY}
  //   Screen X/Y: ${e.screenX}, ${e.screenY}`
  // console.log('onDoubleClick', t, document.body.clientWidth)
}
