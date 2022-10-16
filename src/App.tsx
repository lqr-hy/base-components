import React from 'react'
import Button from './components/Button/Button'
import Menu from './components/Menu/Menu'
import MenuItem from './components/Menu/MenuItem'
import SubMenu from './components/Menu/SubMenu'
import Icon from './components/Icon/Icon'
import LongListScroll from './components/LongListScroll'

const list: Array<any> = []
for (let i = 0; i < 100; i++) {
  list.push({
    name: i,
    num: i + '你好'
  })
}
function App() {
  const renderList = (style: any, list: any[]) => {
    return list.map((item, index) => {
      return (
        <div className="l-list-item" key={index} style={style}>
          {item.num}
        </div>
      )
    })
  }
  return (
    <div className="App">
      <Icon theme="danger" icon="arrow-down" size="lg" />
      <Menu
        defaultIndex="0"
        onSelect={(index) => alert(index)}
        mode="horizontal"
        defaultOpenSubMenus={['2']}
      >
        <MenuItem>A</MenuItem>
        <MenuItem>B</MenuItem>
        <SubMenu title="dropdown">
          <MenuItem>1</MenuItem>
          <MenuItem>2</MenuItem>
          <MenuItem>3</MenuItem>
        </SubMenu>
        <MenuItem>C</MenuItem>
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
      <Button btnType="link" href="http://www.baidu.com" disabled>
        disabled link
      </Button>
      <Button btnType="link" target="_blank" href="http://www.baidu.com">
        Link
      </Button>
      <Button btnType="primary">Primary</Button>
      <Button btnType="default"> Default</Button>
      <Button btnType="danger"> Danger</Button>
      <Button btnType="danger" size="sm">
        {' '}
        Danger
      </Button>
      <LongListScroll
        listData={list}
        countHeight={100}
        rendNum={15}
        render={renderList}
      />
      App
    </div>
  )
}

export default App
