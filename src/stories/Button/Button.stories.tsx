import React from "react";
import '../../styles/index.scss'

// ts模式的校验
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { action } from '@storybook/addon-actions'

//导入组件 
import Button from "../../components/Button/Button";

// 组件命名
export default {
  title: 'Component/Button',
  component: Button
} as ComponentMeta<typeof Button>


// 创建了一个模板的艺术地图如何渲染
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} >{args.children}</Button>

export const Default = Template.bind({})
Default.args = {
  btnType: 'default',
  children: 'AA',
  onClick: action('---'),
  disabled: false,
  className: 'btn'
}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true,
}

export const Primary = Template.bind({})
Primary.args = {
  btnType: 'primary',
  size: 'sm'
}

export const Danger = Template.bind({})
Danger.args = {
  btnType: 'danger',
  size: 'lg'
}

export const Success =  Template.bind({})
Success.args = {
  btnType: 'success'
}

export const Warning = Template.bind({})
Warning.args = {
  btnType: 'warning'
}

export const Info = Template.bind({})
Info.args = {
  btnType: 'info'
}

export const Link = Template.bind({})
Link.args = {
  btnType: 'link',
  herf: 'https://www.google.com'
}