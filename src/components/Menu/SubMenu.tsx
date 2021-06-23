import React, { useContext, FunctionComponentElement, useState } from 'react'
import classNames from 'classnames'
import { MenuContext } from './index'
import { MenuItemProps } from './MenuItem'

export interface SubMenuProps {
  className?: string
  index?: string
  title?: string
}

const SubMenu: React.FC<SubMenuProps> = ({
  index,
  title,
  className,
  children
}) => {
  const content = useContext(MenuContext)
  const openSubMenus = content.defaultOpenSubMenus as Array<string>
  const isOpened =
    index && content.mode === 'vertical' ? openSubMenus.includes(index) : false // 设置默认展开
  const [openMenu, setOpen] = useState(isOpened)
  const classes = classNames('l-menu-item l-submenu-item', {
    'l-is-active': content.index === index,
    'l-is-vertical': content.mode === 'vertical'
  })

  // 处理纵向点击
  const handerClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(!openMenu)
  }
  let timer: any
  //  处理横向触摸
  const handerEnter = (e: React.MouseEvent, toggle: boolean) => {
    clearTimeout(timer)
    e.preventDefault()
    timer = setTimeout(() => {
      setOpen(toggle)
    }, 300)
  }

  //  判断是横向还是纵向
  const clickModeVer = content.mode === 'vertical' ? { onClick: handerClick } : {}
  const moveModeHor = content.mode !== 'vertical'
      ? {
          onMouseEnter: (e: React.MouseEvent) => {
            handerEnter(e, true)
          },
          onMouseLeave: (e: React.MouseEvent) => {
            handerEnter(e, false)
          }
        }
      : {}
  // 创建返回的children
  const renderChildren = () => {
    // 创建class
    const subClassName = classNames('l-submenu', { 'menu-opened': openMenu })
    const chilrenComponent = React.Children.map(children, (child, i) => {
      const childElement = child as FunctionComponentElement<MenuItemProps>
      if (childElement.type.displayName === 'MenuItem') {
        return React.cloneElement(childElement, {
          index: `${index}-${i}`
        })
      } else {
        console.error('Warnning:  SubMenu children must be MenuItem')
      }
    })
    return <ul className={subClassName}>{chilrenComponent}</ul>
  }
  return (
    <li key="index" className={classes} {...moveModeHor}>
      <div className="l-submenu-title" {...clickModeVer}>
        {title}
      </div>
      {renderChildren()}
    </li>
  )
}

SubMenu.displayName = 'SubMenu'

export default SubMenu
