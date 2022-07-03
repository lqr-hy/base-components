import React from 'react'
import classNames  from 'classnames'
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
// 引入icon组件库
import { library } from '@fortawesome/fontawesome-svg-core'
// 引入全部字体图标
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)

export type ThemeProps = "primary" | "secondary" | "success" | "info" | "warning" | "danger" | "light" | "dark"

export interface IconProps extends FontAwesomeIconProps {
  theme?: ThemeProps
}

const Icon: React.FC<IconProps> = (props) =>{
  const { className, theme, ...restProps } = props
  const classes = classNames('l-icon', className, {
    [`icon-${theme}`]: theme
  })

  return (
    <FontAwesomeIcon className={classes} {...restProps}/>
  )
}

export default Icon