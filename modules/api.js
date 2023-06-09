const host = "https://wedev-api.sky.pro/api/v2/viktoria/comments";


export function getComments() {
    return fetch(host, {
        method: "GET",
      })
        .then((response) => {
          return response.json();
        })
}

export const failedServer = "Сервер сломался, попробуй позже";
export const failedInput = "В поле ввода должно быть минимум три символа";
export function postComments({text, token}) {
    return fetch(host, {
        method: "POST",
        body: JSON.stringify({
          text,
        }),
        headers: {
          Authorization: token,
        },
      }).then((response) => {
        console.log(response);
        if (response.status === 201) {
          return response.json();
        } else if (response.status === 500) {
          return Promise.reject(new Error(failedServer));
        } else {
          return Promise.reject(new Error(failedInput));
        }
      })
}

export function loginApi({login, password}) {
  return fetch('https://wedev-api.sky.pro/api/user/login', {
    method: 'POST',
    body: JSON.stringify({
      login,
      password,
    })
  }).then((response) => {
    if (response.status == 400) {
      throw new Error("Неверный логин или пароль")
    }
    return response.json();
  })
}

export function regApi({name, login, password}) {
  return fetch('https://wedev-api.sky.pro/api/user', {
    method: 'POST',
    body: JSON.stringify({
      name,
      login,
      password,
    })
  }).then((response) => {
    if (response.status == 400) {
      throw new Error("Пользователь с таким логином уже существует") 
    }
    return response.json();
  })  
}