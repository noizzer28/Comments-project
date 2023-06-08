const host = "https://wedev-api.sky.pro/api/v2/vikky/comments";


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