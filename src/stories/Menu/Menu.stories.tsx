// ts模式的校验
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Menu, MenuItem, SubMenu } from '../../components/Menu'

export default {
  title: 'Component/Menu',
  component: Menu
} as ComponentMeta<typeof Menu>

const Template: ComponentStory<typeof Menu> = (args) => (
  <Menu {...args}>
    <MenuItem>cool link</MenuItem>
    <MenuItem disabled>cool link 2</MenuItem>
    <MenuItem>cool link3</MenuItem>
    <SubMenu title="dropdown">
      <MenuItem>dropdown 1</MenuItem>
      <MenuItem>dropdown 2</MenuItem>
      <MenuItem>dropdown 3</MenuItem>
    </SubMenu>
  </Menu>
)

export const Horizontal = Template.bind({})
Horizontal.args = {
  defaultIndex: '0',
  mode: 'horizontal'
}

export const Vertical = Template.bind({})
Vertical.args = {
  defaultIndex: '0',
  mode: 'vertical',
  defaultOpenSubMenus: ['3']
}