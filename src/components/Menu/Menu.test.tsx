import React from 'react'
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import Menu, { IMenuProps } from './Menu'
import MenuItem from './MenuItem'
import SubMenu from './SubMenu'

const testProps: IMenuProps = {
  defaultIndex: '0',
  className: 'test',
  onSelect: jest.fn()
}

const testVerProps: IMenuProps = {
  defaultIndex: '0',
  mode: 'vertical'
}

const getMenuComponents = (props: IMenuProps) => {
  return (
    <Menu {...props}>
      <MenuItem >active</MenuItem>
      <MenuItem  disabled>disabled</MenuItem>
      <MenuItem >xyz</MenuItem>
      <SubMenu title='drop'>
        <MenuItem>
          dropdown
        </MenuItem>
      </SubMenu>
    </Menu>
  )
}

const createStyleFile = () =>{
  const cssFile: string = `
    .l-submenu{
      display:none
    }
    .l-submenu.menu-opened{
      display:block
    }
  `
  const style = document.createElement('style')
  style.type = 'text/css'
  style.innerHTML = cssFile
  return style
}

let wrapper:RenderResult, menuElement:HTMLElement, activeElement:HTMLElement,disabledELement:HTMLElement
describe('test menu and menuItem component', () => {
  // 将公用的变量放在这个函数，这个函数在每个casez执行之前都会运行
  beforeEach(()=>{
    wrapper = render(getMenuComponents(testProps))
    // 插入css文件
    wrapper.container.append(createStyleFile())
    // 获取更节点 datab  -testid = 'test-menu'
    menuElement = wrapper.getByTestId('test-menu')
    activeElement = wrapper.getByText('active')
    disabledELement = wrapper.getByText('disabled')
  })
  it('should render correct Menu and MenuItem based on default props', () => {
    // 是否在document中
    expect(menuElement).toBeInTheDocument()
    // 是否存在class
    expect(menuElement).toHaveClass('l-menu test')
    // 判断子元素的个数
    // expect(menuElement.getElementsByTagName('li').length).toEqual(3)
    expect(menuElement.querySelectorAll(':scope > li').length).toEqual(4)
    // 判断activeElement元素是否再存相应类
    expect(activeElement).toHaveClass('l-menu-item l-is-active')
    // 判读disabledElement 
    expect(disabledELement).toHaveClass('l-menu-item l-is-disabled')

  })
  it('click items should change active and call the right callback', ()=> {
    // 获取xyz的节点
    const thirdItem = wrapper.getByText('xyz')
    // 点击当前节点
    fireEvent.click(thirdItem)
    // 但前点击的有活动的类样式
    expect(thirdItem).toHaveClass('l-is-active')
    // 之前活动的节点没有l-is-actived
    expect(activeElement).not.toHaveClass('l-is-active')
    // 函数onSelect被调用 
    expect(testProps.onSelect).toHaveBeenCalledWith('2')
    // 点击disableElement 
    fireEvent.click(disabledELement)
    // disabledElement 元素应该没有l-is-active
    expect(disabledELement).not.toHaveClass('l-is-active')
    // 函数onSelect不被调用
    expect(testProps.onSelect).not.toHaveBeenCalledWith('1')
  })
  it('should render vertical mode when mode is set to vertical', () => {
    // 清除 beforeEach 里面创建的变量 每个case 结束也都会默认执行cleanup
    cleanup()
    const wrapper = render(getMenuComponents(testVerProps))
    const menuElement = wrapper.getByTestId('test-menu')
    // // 判断当前menuEement有无vertical
    expect(menuElement).toHaveClass('l-menu-vertical')
  })
  it('should show dropdown items when hover on subMenu', async ()=>{
    // 判断当前元素出现在视野中
    expect(wrapper.queryByText('dropdown')).not.toBeVisible()
    // 拿到drop
    const dropDownElement = wrapper.getByText('drop')
    // 移入drop元素
    fireEvent.mouseEnter(dropDownElement) 
    // 断言 dropdown是否显示了 当不适应 await 的时候会失败 因为代码中是用异步
    await waitFor(()=>{
      expect(wrapper.queryByText('dropdown')).toBeVisible()
      }
    )
    // 需要去点击了
    fireEvent.click(wrapper.getByText('dropdown'))
    expect(testProps.onSelect).toHaveBeenCalledWith('3-0')
    // 事件离开 
    fireEvent.mouseLeave(dropDownElement)
    await waitFor(()=>{
      expect(wrapper.queryByText('dropdown')).not.toBeVisible()
    })
  })
})
 