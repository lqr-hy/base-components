import classNames from 'classnames'
import React from 'react'
// import PropsType from 'prop-types'

export enum ButtonSize {
  Large = 'lg',
  Samll = 'sm'
}

export enum ButtonType {
  Primary = 'primary',
  Default = 'default',
  Danger = 'danger',
  Link = 'link'
}

interface BaseButtonProps {
  className?: string
  disabled?: boolean
  size?: ButtonSize
  btnType?: ButtonType
  children?: React.ReactNode
  herf?: string
}

const Button: React.FC<BaseButtonProps> = (props) => {
  const { btnType, disabled, size, children, herf } = props
  // btn- classNames 设置样式名
  const classes = classNames('btn', {
    [`btn-${btnType}`]: btnType,
    [`btn-${size}`]: size,
    disable: btnType === ButtonType.Link && disabled
  })
  if (btnType === ButtonType.Link) {
    return (
      <a className={classes} href={herf}>
        {children}
      </a>
    )
  } else {
    return (
      <button disabled={disabled} className={classes}>
        {children}
      </button>
    )
  }
}

// 默认值
Button.defaultProps = {
  disabled: false,
  children: '按钮',
  btnType: ButtonType.Default
}

// 约定类型
// Button.propTypes = {
//   disabled: PropsType.bool
// }

export default Button
