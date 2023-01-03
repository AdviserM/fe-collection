const throttle = {
  bind: function (el, binding) {
    if (typeof binding.value !== 'function') return
    let flag = true;
    let timer = null
    const timeout = binding.arg || 500
    const handler = function () {
      if (!flag) return;
      //执行之后开关关闭
      flag && binding.value()
      flag = false
      if (timer !== null) {
        clearTimeout(timer)
        timer = null
      }
      timer = setTimeout(() => {
        flag = true;
      }, +timeout);
    }
    el.addEventListener('click', handler)
  },
  unbind: function (el, binding) {
    el.removeEventListener('click', handler)
  }
}

export default throttle
