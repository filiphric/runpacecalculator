export const useTheme = () => {
  const isDark = ref(false)

  onMounted(() => {
    isDark.value =
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  const toggleTheme = () => {
    isDark.value = !isDark.value
    if (isDark.value) {
      localStorage.theme = 'dark'
      document.documentElement.classList.add('dark')
    } else {
      localStorage.theme = 'light'
      document.documentElement.classList.remove('dark')
    }
  }

  return {
    isDark,
    toggleTheme,
  }
}