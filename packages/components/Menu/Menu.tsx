import React, { createContext, PropsWithChildren, useState } from 'react';
import classNames from 'classnames';
import { MenuItemProps } from './MenuItem';
import { createNamespace } from '@xb-onepiece/utils';

export const menuBem = createNamespace('menu');

//  竖排 或者横排
type MenuMode = 'horizontal' | 'vertical';
// 当前选中的回调
type selectCallback = (SelectedIndex: string) => void;
export interface IMenuProps extends PropsWithChildren {
  /**
   * 默认选中的菜单项
   */
  defaultIndex?: string;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 横向或者纵向
   */
  mode?: MenuMode;
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
  /**
   * 选中回调
   */
  onSelect?: selectCallback;
  /**
   * 默认展开的子菜单
   */
  defaultOpenSubMenus?: string[];
}

export interface IMenuContext {
  index?: string;
  onSelect?: selectCallback;
  mode?: MenuMode;
  defaultOpenSubMenus?: string[];
}

export const MenuContext = createContext<IMenuContext>({ index: '0' });

const Menu: React.FC<IMenuProps> = (props) => {
  const {
    className,
    defaultIndex = '0',
    mode = 'horizontal',
    style,
    children,
    onSelect,
    defaultOpenSubMenus = []
  } = props;
  const [currentActive, setActive] = useState(defaultIndex);
  const classes = classNames(menuBem.b('container'), className, {
    [menuBem.b('vertical')]: mode === 'vertical',
    [menuBem.b('horizontal')]: mode !== 'vertical'
  });

  // 改变选项卡
  const handleClick = (index: string) => {
    // 设置当前的index
    setActive(index);
    if (onSelect) {
      onSelect(index);
    }
  };
  const passContext: IMenuContext = {
    index: currentActive ? currentActive : '0',
    onSelect: handleClick,
    mode,
    defaultOpenSubMenus
  };

  // 限制返回的children 循环渲染子组件
  const renderChildren = () => {
    return React.Children.map(children, (child, index) => {
      // 想要拿到display属性，就需要类型断言 转换成fun实例
      const childElement = child as React.FunctionComponentElement<MenuItemProps>;
      //  拿出displayName
      const { displayName } = childElement.type;
      // 如果是相应节点  第一个字母小写切记
      if (displayName === 'MenuItem' || displayName === 'SubMenu') {
        // 克隆元素
        return React.cloneElement(childElement, { index: index.toString() });
      } else {
        console.error('Warnning: you should input MenuItem component');
      }
    });
  };
  return (
    <ul className={classes} style={style} data-testId="test-menu">
      {/* 注入子组件 */}
      <MenuContext.Provider value={passContext}>{renderChildren()}</MenuContext.Provider>
    </ul>
  );
};

export default Menu;
