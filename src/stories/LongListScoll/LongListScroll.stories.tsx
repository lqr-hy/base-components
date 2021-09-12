import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import LongListScroll from '../../components/LongListScroll'
import '../../styles/index.scss'

const list: Array<any> = []
for (let i = 0; i < 100; i++) {
  list.push({
    name: i,
    num: i + '你好'
  })
}

const renderList = (style: any, list: any[]) => {
  return list.map((item, index) => {
    return (
      <div className="l-list-item" key={index} style={style}>
        {item.num}
      </div>
    )
  })
}

export default {
  title: 'Component/LongListScroll',
  component: LongListScroll
} as ComponentMeta<typeof LongListScroll>

const Template: ComponentStory<typeof LongListScroll> = (args) => (
  <LongListScroll {...args} />
)

export const Default = Template.bind({})
Default.args = {
  listData: list,
  countHeight: 100,
  rendNum: 15,
  render: renderList
}
