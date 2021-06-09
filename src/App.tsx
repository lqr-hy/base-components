import React from 'react'
import Button, { ButtonSize, ButtonType } from './components/Button'

function App() {
  return (
    <div className="App">
      <Button>A</Button>
      <Button disabled size={ButtonSize.Large}>
        大小
      </Button>
      <Button btnType={ButtonType.Link} herf="http://www.baidu.com" disabled>
        连接
      </Button>
    </div>
  )
}

export default App
