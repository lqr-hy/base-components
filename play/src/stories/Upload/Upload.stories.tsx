import type { Meta, StoryObj } from '@storybook/react';
import { Button, Upload } from '@xb-onepiece/components';
import React, { useState } from 'react';

const meta = {
  title: 'Component/Upload',
  component: Upload,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof Upload>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args) => {
  const [cancel, setCancel] = useState(false);
  const [progress, setProgress] = useState(0);
  return (
    <>
      <Upload {...args} cancel={cancel} onProgress={(e) => setProgress(e)} />
      <Button
        onClick={() => {
          setCancel(!cancel);
        }}
      >
        {cancel ? '取消' : '继续'}
      </Button>
      <div>进度：{progress}%</div>
    </>
  );
};

export const FragmentUpload: Story = {
  args: {
    maxFileSize: 1000,
    fragmentSize: 100,
    cancel: false,
    isUseFragmentUpload: true
  },
  render: (args) => {
    return Template(args);
  }
};

export const DefaultUpload: Story = {
  args: {
    maxFileSize: 1000,
    fragmentSize: 100,
    cancel: false,
    isUseFragmentUpload: false
  },
  render: (args) => {
    return Template(args);
  }
};
