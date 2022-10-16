import { useEffect, useState, MouseEvent } from 'react'
import { IColorPickProps } from './colorPick'

type SetPanel = (val: boolean) => void
type SetCurrentColor = (val: string) => void
type ChangeColor = (val: string) => void

interface IColorCanvasProps extends Omit<IColorPickProps, 'value' | 'disabled'> {
  setPanel: SetPanel
  curColor: string
  setCurrentColor: SetCurrentColor
  changeColor: ChangeColor
}

let canvas: HTMLCanvasElement
let ctx: any
const width = 286
const height = 200
let prevPosColor = {}
let alpha = '1'

export const ColorCanvas: React.FC<IColorCanvasProps> = (props) => {
  const { showAlpha, colorFormat, setPanel, curColor, setCurrentColor, changeColor } = props
  let curId = 'cur-' + Date.now()
  let barId = 'bar' + Date.now()
  let canvasId = 'canvas-' + Date.now()
  let alphaId = 'alpha-' + Date.now()
  const [activeColor, setActiveColor] = useState('#ff0000')

  const cancelPanel = () => {
    setPanel(false)
  }

  useEffect(() => {
    document.body.addEventListener('click', cancelPanel)
    init()
    return () => {
      document.body.removeEventListener('click', cancelPanel)
    }
  }, [])

  useEffect(() => {
    if (curColor) {
      resetCurColor()
    }
  }, [curColor])

  const init = () => {
    canvas = document.getElementById(canvasId) as HTMLCanvasElement
    ctx = canvas.getContext('2d')
    makeColorBar()
    makeColorBox('#ff0000')
  }

  /* 绘制左侧面板颜色选择条 */
  const makeColorBar = () => {
    const gradientBar = ctx.createLinearGradient(0, 0, 0, height)
    gradientBar.addColorStop(0, '#f00')
    gradientBar.addColorStop(1 / 6, '#f0f')
    gradientBar.addColorStop(2 / 6, '#00f')
    gradientBar.addColorStop(3 / 6, '#0ff')
    gradientBar.addColorStop(4 / 6, '#0f0')
    gradientBar.addColorStop(5 / 6, '#ff0')
    gradientBar.addColorStop(1, '#f00')

    ctx.fillStyle = gradientBar
    ctx.fillRect(0, 0, 20, height)
  }

  /* 绘制颜色选择区域 */
  const makeColorBox = (color: string) => {
    const gradientBase = ctx.createLinearGradient(30, 0, width, 0)
    gradientBase.addColorStop(1, color)
    gradientBase.addColorStop(0, 'rgba(255,255,255,1)')
    ctx.fillStyle = gradientBase
    ctx.fillRect(30, 0, width, height)

    const my_gradient1 = ctx.createLinearGradient(0, 0, 0, height)
    my_gradient1.addColorStop(0, 'rgba(0,0,0,0)')
    my_gradient1.addColorStop(1, 'rgba(0,0,0,1)')
    ctx.fillStyle = my_gradient1
    ctx.fillRect(30, 0, width, height)
  }

  /* canvas点击 */
  const onCanvasClick = (e: any) => {
    const ePos = {
      x: e.nativeEvent.offsetX || e.nativeEvent.layerX,
      y: e.nativeEvent.offsetY || e.nativeEvent.layerY
    }
    let rgbaStr: string | string[] = '#000'
    if (ePos.x >= 0 && ePos.x < 20) {
      rgbaStr = getRgbaAtPoint(ePos, 'bar')
      const barBlock = document.getElementById(barId) as HTMLElement
      barBlock.style.top = ePos.y + 'px'
      setActiveColor(rgb2hex('rgb(' + rgbaStr.slice(0, 3).join() + ')'))
      makeColorBox('rgb(' + rgbaStr.slice(0, 3).join() + ')')

      const newPointColor = getRgbaAtPoint(prevPosColor, 'box')
      setCurColor(newPointColor)
    } else if (ePos.x >= 30) {
      rgbaStr = getRgbaAtPoint(ePos, 'box')
      prevPosColor = ePos
      const cur = document.getElementById(curId) as HTMLElement
      cur.style.left = ePos.x + 'px'
      cur.style.top = ePos.y + 'px'
      setCurColor(rgbaStr)
    } else {
      return
    }
  }

  /* canvas鼠标按下，绑定鼠标拖动函数 */
  const onCanvasMousedown = (ev?: any, type?: string) => {
    const ePos = {
      x: ev.nativeEvent.layerX || ev.nativeEvent.offsetX,
      y: ev.nativeEvent.layerY || ev.nativeEvent.offsetY
    }
    const offsetTop = parseInt(ev.target.offsetTop)
    const offsetLeft = parseInt(ev.target.offsetLeft)
    if (type === 'cur' || (ePos.x >= 30 && ePos.x < 30 + width && ePos.y >= 0 && ePos.y < height)) {
      const cur = document.getElementById(curId) as HTMLElement
      document.onmouseup = function () {
        document.onmouseup = document.onmousemove = null
      }
      document.onmousemove = function (e) {
        try {
          const pos = {
            x: e.clientX - ev.clientX + ev.nativeEvent.offsetX + offsetLeft,
            y: e.clientY - ev.clientY + ev.nativeEvent.offsetY + offsetTop
          }

          pos.x = pos.x <= 30 ? 30 : pos.x && (pos.x > width ? width : pos.x)
          pos.y = pos.y <= 0 ? 0 : pos.y && (pos.y > height ? height : pos.y)

          const rgbaStr = getRgbaAtPoint(pos, 'box')
          prevPosColor = ePos
          setCurColor(rgbaStr)
          cur.style.left = pos.x + 'px'
          cur.style.top = pos.y + 'px'
        } catch (e) {
          console.log(e)
        }
      }
    } else if (ePos.x <= 20 && ePos.y <= height) {
      const bar = document.getElementById(barId) as HTMLElement
      document.onmouseup = function () {
        document.onmouseup = document.onmousemove = null
      }
      document.onmousemove = function (e) {
        try {
          const pos = {
            x: 0,
            y: e.clientY - ev.clientY + ev.nativeEvent.offsetY + offsetTop
          }

          pos.y = pos.y <= 0 ? 0 : pos.y && (pos.y > height ? height : pos.y)

          const rgbaStr = getRgbaAtPoint(pos, 'box')
          bar.style.top = pos.y + 'px'
          setActiveColor(rgb2hex('rgb(' + rgbaStr.slice(0, 3).join() + ')'))
          makeColorBox('rgb(' + rgbaStr.slice(0, 3).join() + ')')
          // 移动左侧滑块改变颜色
          const newPointColor = getRgbaAtPoint(prevPosColor, 'box')
          setCurColor(newPointColor)
        } catch (e) {
          console.log(e)
        }
      }
    }
  }

  /* 透明度控制条点击 */
  const onAlphaClick = (e) => {
    const x = e.nativeEvent.offsetX || e.nativeEvent.layerX
    const bar = document.getElementById(alphaId) as HTMLElement
    const parentNode = bar.parentNode as HTMLElement
    alpha = parseFloat(String(x / parentNode.clientWidth)).toFixed(2)
    resetCurColor()
  }

  /* 透明度控制 */
  const onAlphaMousedown = (ev: MouseEvent) => {
    const offsetLeft = parseInt(ev.target.offsetLeft)
    const bar = document.getElementById(alphaId) as HTMLElement
    const parentNode = bar.parentNode as HTMLElement
    document.onmouseup = function () {
      document.onmouseup = document.onmousemove = null
    }
    document.onmousemove = function (e) {
      try {
        const pos = {
          x: e.clientX - ev.nativeEvent.clientX + ev.nativeEvent.offsetX + offsetLeft,
          y: 0
        }
        pos.x =
          pos.x <= 0
            ? 0
            : pos.x && (pos.x > parentNode.clientWidth ? parentNode.clientWidth : pos.x)

        const newAlpha = parseFloat(String(pos.x / parentNode.clientWidth)).toFixed(2)
        alpha = newAlpha
        resetCurColor()
      } catch (e) {
        console.log(e)
      }
    }
  }
  /* 透明度变化重新计算当前颜色值 */
  const resetCurColor = () => {
    let currentColor = curColor
    const currentAlpha = alpha
    const reg = /^(rgb|RGB)/
    if (!reg.test(curColor)) {
      currentColor = hex2rgb(currentColor.slice(0, 7))
    }
    const colorArr: any[] = currentColor.replace(/(?:rgba|rgb|RGBA|RGB|\(|\))*/g, '').split(',')
    colorArr[3] = currentAlpha
    setCurColor(colorArr)
  }
  /* 设置当前颜色值 */
  const setCurColor = (rgbaStr: string[]) => {
    let txt = 'a'
    if ((rgbaStr.length === 4 && rgbaStr[3] === '1') || !showAlpha) {
      rgbaStr = rgbaStr.slice(0, 3)
      txt = ''
    }
    if (colorFormat === 'hex') {
      const a = rgb2hex('rgb' + txt + '(' + rgbaStr.join() + ')')
      setCurrentColor(a)
    } else if (colorFormat === 'rgb') {
      setCurrentColor('rgb' + txt + '(' + rgbaStr.join() + ')')
    }
  }

  /* 获取rgb */
  const getRgbaAtPoint = (pos: any, area: any) => {
    let imgData: any
    if (area === 'bar') {
      imgData = ctx.getImageData(0, 0, 20, height)
    } else {
      imgData = ctx.getImageData(0, 0, width, height)
    }
    const data = imgData.data
    const dataIndex = (pos.y * imgData.width + pos.x) * 4
    /* 开始消除误差 */
    if (pos.x >= 30 && pos.y > height - 3) {
      return [0, 0, 0, alpha]
    }
    if (pos.x >= 30 && pos.y <= 1) {
      data[dataIndex] = 255
    }
    if (pos.x >= 30 && pos.x <= 31) {
      return [data[dataIndex], data[dataIndex], data[dataIndex], alpha]
    }
    if (pos.x >= width - 1) {
      return [data[dataIndex], 0, 0, alpha]
    }
    /* 消除误差结束 */
    return [data[dataIndex], data[dataIndex + 1], data[dataIndex + 2], alpha]
  }
  /* rgb/rgba色值转16进制 */
  const rgb2hex = (rgb: string) => {
    const reg = /^(rgb|RGB)/
    let a
    if (reg.test(rgb)) {
      const colorArr = rgb.replace(/(?:rgba|rgb|RGBA|RGB|\(|\))*/g, '').split(',')
      const alpha = ((colorArr && colorArr[3]) || '').trim()
      let hex =
        '#' +
        (
          (1 << 24) +
          (parseInt(colorArr[0]) << 16) +
          (parseInt(colorArr[1]) << 8) +
          parseInt(colorArr[2])
        )
          .toString(16)
          .slice(1)
      if (alpha !== '' && alpha !== '1') {
        a = ((Number(alpha) * 255) | (1 << 8)).toString(16).slice(1)
        hex = hex + a
      }
      return hex
    } else {
      return rgb
    }
  }
  /* 16进制色值转rgb */
  const hex2rgb = (hex: string) => {
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
    let color = hex.toLowerCase()
    if (reg.test(color)) {
      if (color.length === 4) {
        let colorNew = '#'
        for (var i = 1; i < color.length; i += 1) {
          colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1))
        }
        color = colorNew
      }
      const colorChange = []
      for (var i = 1; i < color.length; i += 2) {
        colorChange.push(parseInt('0x' + color.slice(i, i + 2)))
      }
      return 'rgb(' + colorChange.join(',') + ')'
    } else {
      return color
    }
  }

  return (
    <div
      className='l-panel'
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
      }}
    >
      {/* 画布 */}
      <div className='l-canvas'>
        <canvas
          id={canvasId}
          width={width}
          height={height}
          onClick={(e) => onCanvasClick(e)}
          onMouseDown={(e) => onCanvasMousedown(e)}
        ></canvas>
        {/* 当前选中小块 */}
        <em className='l-cur' id={curId} onMouseDown={(e) => onCanvasMousedown(e, 'cur')}></em>
        {/* 左侧色条选中小块 */}
        <em className='l-bar' id={barId} onMouseDown={(e) => onCanvasMousedown(e, 'bar')}></em>
        {/* 透明度控制条 */}
        <div className='l-alpha-silder' v-if='showAlpha'>
          <div
            className='l-alpha-silder-bar'
            style={{
              background: `linear-gradient(to right, rgba(255, 69, 0, 0) 0%, ${activeColor}  100%`
            }}
            onClick={(e) => onAlphaClick(e)}
            onMouseDown={(e) => onAlphaMousedown(e)}
          ></div>
          <em
            className='l-alpha'
            id={alphaId}
            style={{ left: Number(alpha) * 100 + '%' }}
            onMouseDown={(e) => onAlphaMousedown(e)}
          ></em>
        </div>
      </div>
      {/* 底部按钮栏 */}
      <div className='l-control'>
        <input className='l-input' value={curColor} onChange={
          (e) => {
            console.log(e)
            setCurrentColor(e.target.value)
            makeColorBox(e.target.value)
          }
        } />
        <div className='l-btns'>
          <div className='l-btn-clear' onClick={() => setCurrentColor('')}>
            清空
          </div>
          <div
            className='l-btn-confirm'
            onClick={() => {
              changeColor(curColor)
              cancelPanel()
            }}
          >
            确定
          </div>
        </div>
      </div>
    </div>
  )
}
