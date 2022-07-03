// ts模式的校验
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { useState } from 'react'

import { ColorPick } from '../../components/ColorPick'

export default {
  title: 'Component/ColorPick',
  component: ColorPick
} as ComponentMeta<typeof ColorPick>

const Template: ComponentStory<typeof ColorPick> = (args) => {
  const [value, changeColor] = useState(args.value)

  return (
    <div style={{ margin: '0 auto', width: '100px' }}>
      <ColorPick {...args} changeColor={changeColor}></ColorPick>
      <div>{value}</div>
    </div>
  )
}

export const Hex = Template.bind({})
Hex.args = {
  showAlpha: true,
  value: '#ff0000'
}

export const RGB = Template.bind({})
RGB.args = {
  showAlpha: true,
  colorFormat: 'rgb',
  value: '#ff0'
}
