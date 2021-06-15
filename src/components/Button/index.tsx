import classNames from 'classnames'
import React from 'react'
// import PropsType from 'prop-types'

export type ButtonSize = 'lg' | 'sm'

export type ButtonType = 'primary' | 'default' | 'danger' | 'link'

interface BaseButtonProps {
  className?: string
  disabled?: boolean
  size?: ButtonSize
  btnType?: ButtonType
  children?: React.ReactNode
  herf?: string
}
// button 的默认属性
type NativeButtonProps = React.ButtonHTMLAttributes<HTMLElement> &
  BaseButtonProps
// A 标签的默认属性
type AnchorButtonProps = React.AnchorHTMLAttributes<HTMLElement> &
  BaseButtonProps
// 选择其中的某一项
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>

const Button: React.FC<ButtonProps> = (props) => {
  const { btnType, disabled, size, children, herf, className, ...restProps } =
    props
  // btn- classNames 设置样式名
  const classes = classNames('l-btn', className, {
    [`l-btn-${btnType}`]: btnType,
    [`l-btn-${size}`]: size,
    disabled: btnType === 'link'&& disabled
  })
  if (btnType === 'link') {
    return (
      <a className={classes} href={herf} {...restProps}>
        {children}
      </a>
    )
  } else {
    return (
      <button disabled={disabled} className={classes} {...restProps}>
        {children}
      </button>
    )
  }
}

// 默认值
Button.defaultProps = {
  disabled: false,
  children: '按钮',
  btnType: 'default'
}

// 约定类型
// Button.propTypes = {
//   disabled: PropsType.bool
// }

export default Button
