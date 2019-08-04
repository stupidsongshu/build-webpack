import React from 'react'
import ReactDOM from 'react-dom'

import { a, b } from './tree-shaking'

import '../../commons'

import panda from '../images/panda.jpeg'

import './search.less'

if (false) {
  const funB = b();
  console.log(funB);
}

class Search extends React.Component {
  constructor() {
    super()
    this.state = {
      Text: null
    }
  }

  loadComponent() {
    import('../../loay-load').then((Text) => {
      console.log(Text.default)
      this.setState({
        Text: Text.default
      })
    })
  }

  render() {
    const funA = a()
    const { Text } = this.state
    return (
      <div className="search">
        {funA} search page test 中文测试
        <img src={panda} onClick={this.loadComponent.bind(this)} alt=""/>
        {
          Text ? <Text /> : null
        }
      </div>
    )
  }
}

ReactDOM.render(
  <Search />,
  document.getElementById('root')
)