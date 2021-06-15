import React from 'react'
import Button from './components/Button'
import Menu from './components/Menu'
import MenuItem from './components/Menu/MenuItem'

function App() {
  return (
    <div className="App">
      <Menu defaultIndex={0} mode='vertical'>
        <MenuItem index={0}>A</MenuItem>
        <MenuItem index={1}>B</MenuItem>
        <MenuItem index={2 }>C</MenuItem>
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
