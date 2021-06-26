import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Button, { ButtonProps } from './Button'

const defaultProps = {
  onClick: jest.fn()
}

const testProps: ButtonProps = {
  btnType: 'primary',
  size: 'lg',
  className: 'klass'
}

const disableProps: ButtonProps = {
  disabled: true,
  onClick: jest.fn()
}

describe('test Button component', () => {
  it('should render the correct default button', () => {
    const warpper = render(<Button {...defaultProps}>Nice</Button>)
    const element = warpper.getByText('Nice') as HTMLButtonElement
    // 判断当前元素是不是在document中
    expect(element).toBeInTheDocument()
    // 判断获取的tag  name 是不是 button 
    expect(element.tagName).toEqual('BUTTON')
    // 判断是否又这个类
    expect(element).toHaveClass('btn btn-default')
    // 判断disabled的值
    expect(element.disabled).toBeFalsy()
    // 模拟一个点击事件 判断函数是否被调用
    fireEvent.click(element)
    expect(defaultProps.onClick).toHaveBeenCalled()
  })
  it('should render the correct component based on different props', ()=>{
    const wrapper = render(<Button {...testProps}>Nice</Button>)
    const element = wrapper.getByText('Nice')
    expect(element).toBeInTheDocument()
    expect(element).toHaveClass('btn-primary btn-lg klass')
  })
  it('should render a link when btnType equals link and href is provided', () => {
    const wrapper = render(<Button btnType='link' href='https://www.baidu.com'>Link</Button>)
    const element = wrapper.getByText('Link')
    expect(element).toBeInTheDocument()
    expect(element.tagName).toEqual('A')
    expect(element).toHaveClass('btn btn-link')
  })
  it('should render disabled button when disabled set true', () => {
    const wrapper = render(<Button {...defaultProps}>Nice</Button>)
    const element = wrapper.getByText('Nice') as HTMLButtonElement
    expect(element).toBeInTheDocument()
    expect(element.disabled).toBeFalsy()
    fireEvent.click(element)
    expect(disableProps.onClick).not.toHaveBeenCalled()
  })
})
