import React, { PropsWithChildren, useContext } from 'react';
import classNames from 'classnames';
import { MenuContext } from './Menu';
import { menuBem } from './Menu';

export interface MenuItemProps {
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
  /**
   * 菜单项的索引
   */
  index?: string;
}

const MenuItem = (props: PropsWithChildren<MenuItemProps>) => {
  const { index, disabled, style, className, children } = props;
  const context = useContext(MenuContext);
  const classes = classNames(menuBem.b('item'), className, {
    'l-is-disabled': disabled,
    'l-is-active': context.index === index
  });

  const handleClick = () => {
    if (context.onSelect && !disabled && typeof index === 'string') {
      context.onSelect(index);
    }
  };
  return (
    <li className={classes} style={style} onClick={handleClick}>
      {children}
    </li>
  );
};

// 判断类型
MenuItem.displayName = 'MenuItem';
export default MenuItem;
