import React, { createContext, useState } from 'react'
import classNames from 'classnames'

//  竖排 或者横排
type ModeType = 'horizontal' | 'vertical'
// 当前选中的回调
type selectCallback = (SelectedIndex: number) => void
export interface IMenuProps {
  defaultIndex?: number // 当前索引
  className?: string // 类名
  mode?: ModeType  // 横排或者竖排
  style?: React.CSSProperties // 样式
  onSelect?: selectCallback // 选中
}

export interface IMenuContext {
  index?: number
  onSelect?: selectCallback
}

export const MenuContext = createContext<IMenuContext>({ index: 0 })

const Menu: React.FC<IMenuProps> = (props) => {
  const { className, defaultIndex, mode, style, children, onSelect } = props
  const [currentActive, setActive] = useState(defaultIndex)
  const classes = classNames('l-menu', className, {
    'l-menu-vertical': mode === 'vertical'
  })

  // 改变选项卡
  const handleClick = (index: number) => {
    // 设置当前的index
    setActive(index)
    if (onSelect) {
      onSelect(index)
    }
  }
  const passContext: IMenuContext = {
    index: currentActive ? currentActive : 0,
    onSelect: handleClick
  }
  return (
    <ul className={classes} style={style}>
      {/* 注入子组件 */}
      <MenuContext.Provider value={passContext}>
        {children}
      </MenuContext.Provider>
    </ul>
  )
}

// 初始值
Menu.defaultProps = {
  defaultIndex: 0,
  mode: 'horizontal'
}

export default Menu
