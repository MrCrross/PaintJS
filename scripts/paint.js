const canvas = document.querySelector('#jsCanvas')
const ctx = canvas.getContext('2d')
const range = document.querySelector('#jsRange')
const rangeEraser = document.querySelector('#jsRangeEraser')
const jsColors = document.querySelector('#jsColors')
const colors = jsColors.querySelectorAll('.controls__color')
const mode = document.querySelector('#jsMode')
const clear = document.querySelector('#jsClear')
const eraser = document.querySelector('#jsEraser')
const save = document.querySelector('#jsSave')

const cvsWidth = 700
const cvsHeight = 700

canvas.height = cvsWidth
canvas.width = cvsHeight
ctx.lineWidth = range.value
ctx.strokeStyle = jsColors.querySelector('.active_color').style.backgroundColor
ctx.fillStyle = jsColors.querySelector('.active_color').style.backgroundColor

let painting = false
let filling = false
let eraserCheck = false

function colorClickHandler() {
    colors.forEach(el => el.classList.remove('active_color'))
    this.classList.add('active_color')
    ctx.strokeStyle = this.style.backgroundColor
    ctx.fillStyle = this.style.backgroundColor
}

function modeHandler() {
    if (filling) {
        filling = false
        mode.innerText = 'Заливка'
    } else {
        filling = true
        painting = false
        if (eraserCheck) eraserHandler()
        mode.innerText = 'Рисование'
    }
}

function clearHandler() {
    ctx.fillStyle = canvas.style.backgroundColor
    ctx.fillRect(0, 0, cvsWidth, cvsHeight)
    ctx.fillStyle = this.style.backgroundColor
    localStorage.setItem('img', canvas.toDataURL('image/png'))
}

function eraserHandler() {
    if (!eraserCheck) {
        eraserCheck = true
        range.classList.add('hidden')
        rangeEraser.classList.remove('hidden')
        rangeEraser.classList.add('show')
        eraser.innerText = "Рисование"
        ctx.lineWidth = rangeEraser.value
        ctx.strokeStyle = '#fff'
    } else {
        eraserCheck = false
        eraser.innerText = "Ластик"
        range.classList.remove('hidden')
        rangeEraser.classList.add('hidden')
        rangeEraser.classList.remove('show')
        ctx.lineWidth = range.value
        ctx.strokeStyle = jsColors.querySelector('.active_color').style.backgroundColor
    }
}

function saveHandler() {
    const img = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = img
    link.download = 'img.png'
    console.log(link)
    link.click()
}

function stopPainting() {
    painting = false
}

function startPainting() {
    painting = true
}

function onMouseMove(e) {
    const x = e.offsetX,
        y = e.offsetY
    if (!painting && !filling) {
        ctx.beginPath()
        ctx.moveTo(x, y)
    } else if (painting && !filling) {
        ctx.lineTo(x, y)
        ctx.stroke()
        localStorage.setItem('img', canvas.toDataURL('image/png'))
    }
}

function onMouseDown(e) {
    painting = true
}

function onCanvasClick(e) {
    if (filling) {
        ctx.fillRect(0, 0, cvsWidth, cvsHeight)
    }
}

function init() {
    if (canvas) {
        if (localStorage.getItem('img')) {
            const img = new Image()
            img.onload = () => {
                ctx.drawImage(img, 0, 0)
            }
            img.src = localStorage.getItem('img')
        }
        canvas.addEventListener('mousemove', onMouseMove)
        canvas.addEventListener('mousedown', onMouseDown)
        canvas.addEventListener('mouseup', stopPainting)
        canvas.addEventListener('mouseleave', stopPainting)
        canvas.addEventListener('click', onCanvasClick)
        canvas.addEventListener('contextmenu', (e) => e.preventDefault())
    }

    colors.forEach(el => el.addEventListener('click', colorClickHandler))
    range.addEventListener('input', () => {
        if (!range.classList.contains('hidden')) { ctx.lineWidth = rangeEraser.value } else { ctx.lineWidth = range.value }
    })
    rangeEraser.addEventListener('input', () => {
        if (rangeEraser.classList.contains('show')) { ctx.lineWidth = rangeEraser.value } else { ctx.lineWidth = range.value }
    })
    mode.addEventListener('click', modeHandler)
    clear.addEventListener('click', clearHandler)
    eraser.addEventListener('click', eraserHandler)
    save.addEventListener('click', saveHandler)
}

init()