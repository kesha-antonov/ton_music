import { API_KEY, API_SECRET, PASSWORD, USER } from '../consts'

const API_ROOT = 'https://api.napster.com/'

export const authNapster = () => {
  const url = 'https://api.napster.com/oauth/token'

  const data = new URLSearchParams({
    username: USER,
    password: PASSWORD,
    grant_type: 'password'
  })

  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + (window.btoa(API_KEY + ':' + API_SECRET)),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: data
  }

  return fetch(url, options).then(response => response.json())
}

export const getTopChartTracks = (token) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  }

  return fetch(`${API_ROOT}/v2.2/tracks/top?range=week&isStreamableOnly=true`, options)
    .then(response => response.json())
}

export const getTag = (tag, token) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  }
  return fetch(`${API_ROOT}/genres/${tag}/tracks/top?isStreamableOnly=true`, options)
    .then(response => response.json())
}
