import { Meta, StoryObj } from '@storybook/react';
import { Button } from '@xb-onepiece/components';

const meta = {
  title: 'Component/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '按钮',
    onClick: () => {
      console.log('click');
    },
    width: 100,
    height: 40,
    btnType: 'default',
    tag: 'button',
    enable3D: false,
    disabled: false,
    className: 'newButton'
  }
};

export const Primary: Story = {
  args: {
    children: '按钮',
    onClick: () => {
      console.log('click');
    },
    width: 100,
    height: 40,
    btnType: 'primary',
    tag: 'div',
    enable3D: true
  }
};

export const Disabled: Story = {
  args: {
    children: '按钮',
    onClick: () => {
      console.log('click');
    },
    width: 100,
    height: 40,
    disabled: true,
    btnType: 'warning'
  }
};

export const Link: Story = {
  args: {
    children: '按钮',
    onClick: () => {
      console.log('click');
    },
    width: 100,
    height: 40,
    btnType: 'danger'
  }
};
