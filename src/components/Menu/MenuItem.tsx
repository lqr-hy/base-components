import React, { useContext } from 'react'
import classNames from 'classnames'
import { MenuContext } from './index'

export interface MenuItemProps {
  className?: string
  disabled?: boolean
  style?: React.CSSProperties
  index: number
}

const MenuItem: React.FC<MenuItemProps> = (props) => {
  const { index, disabled, style, className, children } = props
  const context = useContext(MenuContext)
  const classes = classNames('l-menu-item', className, {
    'l-is-disabled': disabled,
    'l-is-active': context.index === index
  })

  const handleClick = () => {
    if (context.onSelect && !disabled) {
      context.onSelect(index)
    }
  }
  return (
    <li className={classes} style={style} onClick={handleClick}>
      {children}
    </li>
  )
}

export default MenuItem
