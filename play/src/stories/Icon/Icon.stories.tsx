import { Meta, StoryObj } from '@storybook/react';
import { Icon } from '@xb-onepiece/components';

const meta = {
  title: 'Component/Icon',
  component: Icon,
  tags: ['autodocs']
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: 'coffee' as const,
    theme: 'primary' as const
  }
};
