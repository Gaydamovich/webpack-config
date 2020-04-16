import * as $ from 'jquery'
import React from 'react'
import ReactDOM from 'react-dom'
import {Post} from '@models/Post'
import './babel'
import './styles/style.css'
import './styles/less.less'
import './styles/scss.scss'
import WebSiteLogo from '@/assets/website'
import json from './assets/data.json'
import xml from './assets/data.xml'
import csv from './assets/data.csv'


const post = new Post('hello world, webpack', WebSiteLogo)
$('pre').addClass('code').html(post.toString())


const App = () => {
  return (
    <div className="container">
      <h1>Webpack...</h1>
      <hr/>
      <div className="logo"/>
      <hr/>
      <pre/>
      <div className="box">
        <h2>Less</h2>
      </div>
      <div className="box1">
        <h2>Sass</h2>
      </div>
    </div>
  )
}

ReactDOM.render(<App/>, document.getElementById('app'))

// console.log(post.toString())
// console.log(post.titleUpperCase)
// console.log('JSON', json)
// console.log('XML', xml)
// console.log('CSV', csv)