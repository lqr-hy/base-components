import { render } from '@testing-library/react';
import { LongListScroll } from '../index';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import React from 'react';

const list: Array<any> = [];
for (let i = 0; i < 100; i++) {
  list.push({
    name: i,
    num: i + '你好'
  });
}

const renderList = (style: any, list: any[]) => {
  return list.map((item, index) => {
    return (
      <div className="l-list-item" key={index} style={style}>
        {item.num}
      </div>
    );
  });
};

const defaultProps = {
  listData: list,
  countHeight: 100,
  rendNum: 15,
  render: renderList
};

describe('test LongListScroll component', () => {
  it('should render the LongListScroll', () => {
    const wrapper = render(<LongListScroll {...defaultProps} />);
    const element = wrapper.getByTestId('test-long');
    expect(element).toBeInTheDocument();
  });
});
