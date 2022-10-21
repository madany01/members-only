'use strict'

// eslint-disable-next-line prettier/prettier
;(() => {
  // eslint-disable-next-line no-undef
  const flashMsgSection = document.querySelector('.section--flash-msgs')
  if (!flashMsgSection) return

  const flashMsgList = flashMsgSection.querySelector('ul')
  const closeFlashMsgBtns = new Set(flashMsgList.querySelectorAll('.flash-msg .close-flash'))

  function removeFlash(e) {
    const { target } = e

    const flashMsgEl = target.closest('.flash-msg')
    flashMsgEl.remove()
    closeFlashMsgBtns.delete(target)

    if (closeFlashMsgBtns.size) return

    flashMsgSection.remove()
  }

  closeFlashMsgBtns.forEach(btn => {
    btn.addEventListener('click', removeFlash)
  })
})()
