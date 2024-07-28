import { Meta, StoryObj } from '@storybook/react';
import { LongListScroll } from '@xb-onepiece/components';
import React from 'react';

const list: Array<{}> = [];
for (let i = 0; i < 100; i++) {
  list.push({
    name: i,
    num: i + '你好'
  });
}

const renderList = (style: any, list: any[]) => {
  return list.map((item, index) => {
    return (
      <div
        className="l-list-item"
        key={index}
        style={{
          ...style,
          padding: 10,
          color: '#555',
          boxSizing: 'border-box',
          borderBottom: '1px solid #999'
        }}
      >
        {item.num}
      </div>
    );
  });
};

const meta = {
  title: 'Component/LongListScroll',
  component: LongListScroll,
  tags: ['autodocs']
} satisfies Meta<typeof LongListScroll>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    listData: list,
    countHeight: 100,
    rendNum: 15,
    render: renderList
  }
};
