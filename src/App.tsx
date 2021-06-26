import React from 'react'
import Button from './components/Button/Button'
import Menu from './components/Menu/Menu'
import MenuItem from './components/Menu/MenuItem'
import SubMenu from './components/Menu/SubMenu'
import Icon from './components/Icon/Icon'
// 引入icon组件库
import { library } from '@fortawesome/fontawesome-svg-core'
// 引入全部字体图标
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)

function App() {
  return (
    <div className="App">
      <Icon theme='danger' icon='arrow-down' size='lg'/>
      <Menu defaultIndex='0' onSelect={(index) => alert(index)} mode='horizontal' defaultOpenSubMenus={['2']}>
        <MenuItem >A</MenuItem>
        <MenuItem >B</MenuItem>
        <SubMenu title='dropdown'>
          <MenuItem>1</MenuItem>
          <MenuItem>2</MenuItem>
          <MenuItem>3</MenuItem>
        </SubMenu>
        <MenuItem >C</MenuItem>
      </Menu>
      <Button
        onClick={(e) => {
          e.preventDefault()
          alert('ssss')
        }}
      >
        中
      </Button>
      <Button size="lg">大</Button>
      <Button size="sm">小</Button>
      <Button btnType="link" herf="http://www.baidu.com" disabled>
        disabled link
      </Button>
      <Button btnType="link" target="_blank" herf="http://www.baidu.com">
        Link
      </Button>
      <Button btnType="primary">Primary</Button>
      <Button btnType="default"> Default</Button>
      <Button btnType="danger"> Danger</Button>
      <Button btnType="danger" size="sm">
        {' '}
        Danger
      </Button>
      App
    </div>
  )
}

export default App
