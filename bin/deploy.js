#!/usr/bin/env node

const path = require('path')
const request = require('request')
const fs = require('fs')

const appConfig = require('../config/app_config')

let dist = path.join(process.cwd(), 'dist')
let token = appConfig.deploy.token

let superToken = ''
if (fs.existsSync('.supertoken.json')) {
  superToken = require('../.supertoken')
}

let url = process.argv[2] === '--prod' ? 'http://mp.duduapp.net/upload/h5deploy' : 'http://dev.mp.duduapp.net/upload/h5deploy'

function walk (dir, iterator) {
  fs.readdir(dir, function (err, contents) {
    if (err) {
      console.log(err)
      return
    }
    contents.forEach(function (name) {
      let item = path.join(dir, name)
      fs.stat(item, function (err, stats) {
        if (err) {
          console.log(err)
          return
        }
        iterator(item, stats)
        if (stats.isDirectory()) {
          return walk(item, iterator)
        }
      })
    })
  })
}

console.log('---------------------------------------------------------------------------')
console.log('当前运行环境: ')
console.log('token:', token)
console.log('url:', url)
console.log('---------------------------------------------------------------------------')

/**
 * 上传
 * @param realPath
 * @param stats
 */
function handler (realPath, stats) {
  if (stats.isDirectory()) {
    return true
  }
  let relativePath = path.relative(dist, realPath)

  let formData = {
    super_token: superToken,
    token: token,
    name: relativePath,
    file: fs.createReadStream(realPath)
  }

  request.post({
    url: url,
    formData: formData,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }, function optionalCallback (err, httpResponse, body) {
    if (err) {
      return console.error('请求失败:', err)
    }
    if (httpResponse.statusCode === 200) {
      console.log(relativePath, ' ---> 请求成功  服务器返回:', body)
    } else {
      console.log(relativePath, ' ---> 请求失败  httpStatusCode:', httpResponse.statusCode)
      console.log(relativePath, ' ---> 请求失败  Body:', body)
    }
  })
  return true
}

function complete () {
  let formData = {
    super_token: superToken,
    token: token,
    complete: 'complete'
  }

  request.post({
    url: url,
    formData: formData,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }, function optionalCallback (err, httpResponse, body) {
    if (err) {
      return console.error('应用迭代失败:', err)
    }
    if (httpResponse.statusCode === 200) {
      console.log('应用迭代成功', body)
    } else {
      console.log('应用迭代失败, httpStatusCode', httpResponse.statusCode)
      console.log('应用迭代失败,  Body:', body)
    }
  })
}

walk(dist, handler)

complete()
