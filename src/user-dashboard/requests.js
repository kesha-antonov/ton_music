const API_ROOT = 'https://api.napster.com/'
// const API_ROOT = 'https://api.spotify.com/v1';

export const authSpotify = () => {
  const client_id = '2f19ff7d97f442c98a4c0bd7a997cf79'
  const client_secret = 'b3eed4a3810d4d5f924782f57146ea93'

  const url = 'https://accounts.spotify.com/api/token'

  const data = new URLSearchParams({
    grant_type: 'client_credentials'
  })

  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + (window.btoa(client_id + ':' + client_secret)),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: data
  }

  return fetch(url, options).then(response => response.json())
}

export const authNapster = () => {
  const url = 'https://api.napster.com/oauth/token'
  const client_id = 'YTlmZWVkM2ItODcyMC00M2EyLTg1Y2MtMGYxN2VkYmMzM2Fm'
  const client_secret = 'ZDdlZDM2MTAtYzg2Ni00ZGIzLWFkZDItMmMwMzQ2NzcyODAy'

  // const detailURL = new URL(window.location);
  // const currentURL = detailURL.href;

  const data = new URLSearchParams({
    username: 'syroszx@gmail.com',
    password: '1q)P2w(O',
    grant_type: 'password'
  })

  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + (window.btoa(client_id + ':' + client_secret)),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: data
  }

  // return fetch(`https://api.napster.com/oauth/access_token?client_id=${API_KEY}&client_secret=${API_SECRET}&response_type=code&grant_type=authorization_code&redirect_uri=${currentURL}&code=${code}`, {
  //     method: 'POST',
  //     headers: {
  //         'Content-Type': 'application/json'
  //     }
  // })
  //     .then(response => response.json());

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

export const getSongs = (searchQuery) => {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '7ecf1ccc22msh00565f3b9c6e80fp1eb8a5jsndded96ccc192',
      'X-RapidAPI-Host': 'theaudiodb.p.rapidapi.com'
    }
  }

  return fetch('https://theaudiodb.p.rapidapi.com/searchalbum.php?s=daft_punk', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err))
}
