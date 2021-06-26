import React, { createContext, useState } from 'react'
import classNames from 'classnames'
import { MenuItemProps } from './MenuItem'

//  竖排 或者横排
type MenuMode = 'horizontal' | 'vertical'
// 当前选中的回调
type selectCallback = (SelectedIndex: string) => void
export interface IMenuProps {
  defaultIndex?: string // 当前索引
  className?: string // 类名
  mode?: MenuMode // 横排或者竖排
  style?: React.CSSProperties // 样式
  onSelect?: selectCallback // 选中
  defaultOpenSubMenus?: string[] //选择默认展开的项
}

export interface IMenuContext {
  index?: string
  onSelect?: selectCallback
  mode?: MenuMode
  defaultOpenSubMenus?: string[]
}

export const MenuContext = createContext<IMenuContext>({ index: '0' })

const Menu: React.FC<IMenuProps> = (props) => {
  const { className, defaultIndex, mode, style, children, onSelect, defaultOpenSubMenus } = props
  const [currentActive, setActive] = useState(defaultIndex)
  const classes = classNames('l-menu', className, {
    'l-menu-vertical': mode === 'vertical',
    'l-menu-horizontal': mode !== 'vertical'
  })

  // 改变选项卡
  const handleClick = (index: string) => {
    // 设置当前的index
    setActive(index)
    if (onSelect) {
      onSelect(index)
    }
  }
  const passContext: IMenuContext = {
    index: currentActive ? currentActive : '0',
    onSelect: handleClick,
    mode,
    defaultOpenSubMenus
  }

  // 限制返回的children 循环渲染子组件
  const renderChildren = () => {
    return React.Children.map(children, (child, index) => {
      // 想要拿到display属性，就需要类型断言 转换成fun实例
      const childElement =
        child as React.FunctionComponentElement<MenuItemProps>
      //  拿出displayName
      const { displayName } = childElement.type
      // 如果是相应节点  第一个字母小写切记
      if (displayName === 'MenuItem' || displayName === 'SubMenu') {
        // 克隆元素
        return React.cloneElement(childElement, { index: index.toString() })
      } else {
        console.error('Warrning: you should input MenuItem component')
      }
    })
  }
  return (
    <ul className={classes} style={style} data-testid="test-menu">
      {/* 注入子组件 */}
      <MenuContext.Provider value={passContext}>
        {renderChildren()}
      </MenuContext.Provider>
    </ul>
  )
}

// 初始值
Menu.defaultProps = {
  defaultIndex: '0',
  mode: 'horizontal',
  defaultOpenSubMenus: [],
}

export default Menu
