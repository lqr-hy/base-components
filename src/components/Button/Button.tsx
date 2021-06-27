import classNames from 'classnames'
import React from 'react'
// import PropsType from 'prop-types'

export type ButtonSize = 'lg' | 'sm'

export type ButtonType = 'primary' | 'default' | 'danger' | 'link' | 'success' | 'info' | 'warning'

export interface BaseButtonProps {
  /** 自定义类 */
  className?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 大小 */
  size?: ButtonSize
  /** 按钮类型 */
  btnType?: ButtonType
  /** 内容 */
  children?: React.ReactNode
  /** 链接 */
  herf?: string,
  /** 回调函数 */
  onClick?: Function
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
  const { btnType, disabled, size, children, herf, className, onClick,  ...restProps } =
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
      <button disabled={disabled} className={classes} {...restProps} onClick={onClick}>
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
