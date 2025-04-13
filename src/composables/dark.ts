import { useColorMode, useDark, useToggle } from '@vueuse/core'

// 默认浅色
if (!localStorage.getItem('vueuse-color-scheme')) {
  const mode = useColorMode()
  mode.value = 'light'
}

export const isDark = useDark()
export const toggleDark = useToggle(isDark)
