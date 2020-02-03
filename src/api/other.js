import axios from 'axios'

// create an axios instance
const service = axios.create()

export function getMapDate () {
    return service({
      url: 'https://www.tianqiapi.com/api?version=epidemic&appid=23035354&appsecret=8YvlPNrz',
      method: 'get'
    })
  }