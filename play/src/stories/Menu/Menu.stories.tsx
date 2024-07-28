import type { Meta, StoryObj } from '@storybook/react';
import { Menu, MenuItem, SubMenu } from '@xb-onepiece/components';
import { IMenuProps } from '@xb-onepiece/components/Menu/Menu';
import React from 'react';

const meta = {
  title: 'Component/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  },
  subcomponents: {
    MenuItem: MenuItem as React.ComponentType<unknown>,
    SubMenu: SubMenu as React.ComponentType<unknown>
  }
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: IMenuProps) => (
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
);

export const Horizontal: Story = {
  args: {
    defaultIndex: '0',
    mode: 'horizontal',
    onSelect: (index: string) => {
      console.log(index);
    }
  },
  render: Template
};

export const Vertical: Story = {
  args: {
    defaultIndex: '0',
    mode: 'vertical',
    defaultOpenSubMenus: ['3']
  },
  render: Template
};
