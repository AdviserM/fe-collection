const debounce = {
  inserted: function (el, binding) {
    let timer
    const timeout = binding.arg || 500
    let timerFlag = true
    el.addEventListener('click', () => {
      if (timer) {
        clearTimeout(timer)
      }
      if (timerFlag) {
        binding.value()
        timerFlag = false
      }
      timer = setTimeout(() => {
        binding.value()
        timerFlag = true
      }, +timeout)
    })
  },
}

export default debounce
