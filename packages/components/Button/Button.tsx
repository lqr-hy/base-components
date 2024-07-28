import classNames from 'classnames';
import React, { PropsWithChildren, useRef } from 'react';

export type ButtonType = 'primary' | 'default' | 'danger' | 'success' | 'info' | 'warning';

export interface ButtonProps {
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 点击事件
   */
  onClick?: () => Promise<unknown> | void;
  /**
   * 宽度
   */
  width?: number;
  /**
   * 高度
   */
  backgroundColor?: string;
  /**
   * 高度
   */
  height?: number;
  /**
   * 按钮类型
   */
  btnType?: ButtonType;
  /**
   * 自定义标签
   */
  tag?: React.ElementType;
  /**
   * 是否开启3D效果
   */
  enable3D?: boolean;
  /**
   * 点击模式
   */
  clickMode?: 'parallel' | 'serial';
}

const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  className,
  disabled,
  onClick,
  children,
  width = 100,
  height = 40,
  backgroundColor,
  btnType = 'default',
  tag: Component = 'button',
  enable3D,
  clickMode = 'parallel'
}) => {
  const isProcessing = useRef(false);

  const handleClick = async () => {
    if (disabled) return;

    if (!onClick) {
      return;
    }

    if (isProcessing.current) {
      return;
    }

    const res: Promise<unknown> | void = onClick();

    if (clickMode === 'serial' && res?.constructor === Promise) {
      isProcessing.current = true;
      try {
        await res;
        isProcessing.current = false;
      } catch (err) {
        isProcessing.current = false;
      }
    }
  };

  const classes = classNames('l-btn', className, {
    [`l-btn-${btnType}`]: backgroundColor ? false : btnType,
    disabled: disabled,
    'l-btn-3d': disabled ? false : enable3D
  });

  return (
    <Component
      className={classes}
      disabled={disabled}
      onClick={handleClick}
      style={{ width, height, backgroundColor }}
    >
      {children}
    </Component>
  );
};

export default Button;
