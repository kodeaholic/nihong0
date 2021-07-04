function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0
  if (document.getElementById(elmnt.id + 'Container')) {
    // if present, the Container is where you move the DIV from:
    document.getElementById(elmnt.id + 'Container').onmousedown = dragMouseDown
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown
  }

  function dragMouseDown(e) {
    e = e || window.event
    e.preventDefault()
    // get the mouse cursor position at startup:
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag
  }

  function elementDrag(e) {
    e = e || window.event
    e.preventDefault()
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + 'px'
    elmnt.style.left = elmnt.offsetLeft - pos1 + 'px'
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null
    document.onmousemove = null
  }
}

function makeElementDraggableOnMobile(elementId) {
  const draggable = document.getElementById(elementId)
  var isMouseDown,
    initX,
    initY,
    height = draggable.offsetHeight,
    width = draggable.offsetWidth

  draggable.addEventListener('touchstart', function (e) {
    // console.log('touchstart')
    isMouseDown = true
    document.body.classList.add('no-select')

    const clientX = e.touches[0].clientX
    const clientY = e.touches[0].clientY
    initX = clientX
    initY = clientY
    // console.log(initX, initY)
  })

  document.addEventListener('touchmove', function (e) {
    if (isMouseDown) {
      const touch = e.touches[0] || e.changedTouches[0]
      const x = touch.pageX
      const y = touch.pageY
      //   console.log(x, y)
      var cx = x - initX,
        cy = y - initY
      if (cx < 0) {
        cx = 0
      }
      if (cy < 0) {
        cy = 0
      }
      if (window.innerWidth - x + initX < width) {
        cx = window.innerWidth - width
      }
      if (y > window.innerHeight - height + initY) {
        cy = window.innerHeight - height
      }
      //   console.log(cx, cy)
      //   draggable.style.right = cx + 'px'
      //   draggable.style.top = cy + 'px'
      draggable.style.left = x + 'px'
      draggable.style.top = y + 'px'
    }
  })

  draggable.addEventListener('touchend', function () {
    // console.log('touchend')
    isMouseDown = false
    document.body.classList.remove('no-select')
  })
}
export { dragElement, makeElementDraggableOnMobile }
