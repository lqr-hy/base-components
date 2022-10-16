import { useState } from 'react'
import { ColorCanvas } from './ColorCanvas'

type ColorFormat = 'hex' | 'rgb'
type ChangeColor = (val: string) => void

export interface IColorPickProps {
  value: string
  disabled?: boolean
  showAlpha?: boolean
  colorFormat?: ColorFormat
  changeColor: ChangeColor
}

const ColorPick: React.FC<IColorPickProps> = (props) => {
  const { value, changeColor, ...restProps } = props

  const [showPanel, setPanel] = useState(false)
  const [curColor, setCurrentColor] = useState(value)

  return (
    <div className='l-color-picker'>
      <div
        className='l-block'
        style={{ backgroundColor: curColor }}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          showPanel ? setPanel(false) : setPanel(true)
        }}
      ></div>
      {showPanel && (
        <ColorCanvas
          setPanel={setPanel}
          {...restProps}
          curColor={curColor}
          setCurrentColor={setCurrentColor}
          changeColor={changeColor}
        />
      )}
    </div>
  )
}

ColorPick.defaultProps = {
  value: '#ff0000',
  colorFormat: 'hex'
}

export { ColorPick }
