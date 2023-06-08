"use strict";

const host = "https://wedev-api.sky.pro/api/v2/vikky/comments";
function formatDate(inputDate) {
  const commentDate = new Date(inputDate);
  const options = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return commentDate.toLocaleDateString("ru-RU", options);
}

let comments = [];

// let token = 'Bearer c8ccbodkdkb8co6gckd8b8cocwdg5g5k5o6g38o3co3cc3co3d03co3bc3b43k37s3c03c83d43co3cw3c03ek';
let token = null;

fetchGet();
function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}

// Ответ на комментарий
// const replyCommentsListener = () => {
//   const replyButtonElements = document.querySelectorAll('.comment');
//   for (const replyButtonElement of replyButtonElements) {
//     replyButtonElement.addEventListener('click', () => {
//       let index = replyButtonElement.dataset.index;
//       commentElement.value = `Quote_start${comments[index].name}: New_line ${comments[index].comment} Quote_end`
//       renderComments();
//     })
//   }
// }
// replyCommentsListener();

function fetchGet() {
    return fetch(host, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        comments = responseData.comments.map((comment) => {
          return {
            name: comment.author.name,
            date: formatDate(comment.date),
            text: comment.text,
            likes: comment.likes,
            isLiked: comment.isLiked,
            isLikeLoading: comment.isLiked,
          };
        });
        renderApp();
        const loadElement = document.getElementById("loading");
        loadElement.style.display = "none";
      })
      .catch(() => {
        console.error("Failed to load, check your connection");
      });
  }
  let isLoginMode = false;

// Рендер комментариев в HTML
const renderApp = () => {
  const commentsHtml = comments
    .map((comment, index) => {
      return `<li class="comment" data-index="${index}">
             <div class="comment-header">
               <div>${comment.name}
                   </div>
               <div>${comment.date}</div>
             </div>
             <div class="comment-body">
               <div class="comment-text">
                 ${comment.text
                   .replaceAll("&", "&amp;")
                   .replaceAll("<", "&lt;")
                   .replaceAll(">", "&gt;")
                   .replaceAll('"', "&quot;")}
               </div>
             </div>
             <div class="comment-footer">
               <div class="likes">
                 <span class="likes-counter">${comment.likes}</span>
                 <button data-index="${index}" id="likes-button" class="like-button 
                 ${comment.isLiked ? "-active-like" : ""} ${
        comment.isLikeLoading ? "-loading-like" : ""
      }">
                 </button>
               </div>
             </div>
           </li>`;
    })
    .join("");

  const appElement = document.getElementById("app");


  if (!token) {
    const appHtml = `  
        <div class="container">
            <div id="loading">Подождите, комментарии загружаются...
            </div>
            <ul class="comments" id="comments-area">
            ${commentsHtml}
            </ul>
        <!-- Register -->
        <br>
        <div>${isLoginMode ? `Зарегистрируйтесь, или <span id="login-link" class="auth-link">войдите</span>` : 
        `Чтобы оставлять коментарии войдите или <span id="login-link" class="auth-link">зарегистрируйтесь</span>
        `}</div>
            <div class="add-form" id="inputs">
            ${isLoginMode ? 
                `        Имя
                <textarea type="textarea" class="add-form-text"
                id="name-input">
                </textarea>
            <br>`: ''}
            Логин
                <textarea type="textarea" class="add-form-text"
                id="login-input"></textarea>
                <br>
            Пароль
                <textarea type="password" class="add-form-text"
                id="password-input"></textarea>
            <div class="add-form-row">
            <button class="add-form-button" id="login-button">
            ${isLoginMode ? `Зарегистрироваться` : `Войти`}
            </button>
            </div>
        </div>
    </div>`;
    appElement.innerHTML = appHtml;
    document.getElementById('login-link').addEventListener("click", () => {
        console.log("www")
        isLoginMode = !isLoginMode;
        fetchGet();
    })
    document.getElementById('login-button').addEventListener('click', () => {
        console.log("works")
        token = 'Bearer c8ccbodkdkb8co6gckd8b8cocwdg5g5k5o6g38o3co3cc3co3d03co3bc3b43k37s3c03c83d43co3cw3c03ek';
        fetchGet();
      })
      return;
  } else {
       const appHtml = `  <div class="container">
            <div id="loading">Подождите, комментарии загружаются...</div>
            <ul class="comments" id="comments-area">
            ${commentsHtml}
            </ul>
            <div class="add-form" id="inputs">
            <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4"
            id="comment-input"></textarea>
            <div class="add-form-row">
            <button class="add-form-button" id="add-comment-button">
                Написать
            </button>
            </div>
            </div>`;
    appElement.innerHTML = appHtml;
    const commentElement = document.getElementById("comment-input");
    const addCommentElement = document.getElementById("add-comment-button");
    //   Обработчик лайков
    const likeCountButtonListener = () => {
        const likeButtonElements = document.querySelectorAll(".like-button");
        for (const likeButtonElement of likeButtonElements) {
        likeButtonElement.addEventListener("click", () => {
            event.stopPropagation();
            let index = likeButtonElement.dataset.index;
            comments[index].isLikeLoading = true;
            renderApp();
            delay(1000).then(() => {
            if (comments[index].isLiked == false) {
                comments[index].likes++;
                comments[index].isLiked = true;
            } else {
                comments[index].likes--;
                comments[index].isLiked = false;
            }
            comments[index].isLikeLoading = false;
            renderApp();
            });
        });
        }
    };
    likeCountButtonListener();
    
    // Написать комментарий
  addCommentElement.addEventListener("click", () => {
    commentElement.classList.remove("validation");
    if (commentElement.value == "") {
      commentElement.classList.add("validation");
      return;
    }
    addCommentElement.disabled = true;
    addCommentElement.textContent = "Данные загружаются...";
    const failedServer = "Сервер сломался, попробуй позже";
    const failedInput = "В поле ввода должно быть минимум три символа";
    const unauthorised = "Необходимо авторизоваться";
    const fetchPost = () => {
      fetch(host, {
        method: "POST",
        body: JSON.stringify({
          text: commentElement.value,
        }),
        headers: {
          Authorization: token,
        },
      })
        .then((response) => {
          console.log(response);
          if (response.status === 201) {
            return response.json();
          } else if (response.status === 500) {
            return Promise.reject(new Error(failedServer));
          } else if (response.status === 401) {
            return Promise.reject(new Error(unauthorised));
          } else {
            return Promise.reject(new Error(failedInput));
          }
        })
        .then((responseJson) => {
          console.log(responseJson);
          addCommentElement.disabled = false;
          addCommentElement.textContent = "Отправить";
          fetchGet();
          commentElement.value = "";
        })
        .catch((error) => {
          if (error.message == failedServer) {
            alert(error);
            fetchPost();
          } else {
            addCommentElement.disabled = false;
            addCommentElement.textContent = "Попробуй еще раз";
            alert(error);
          }
        });
    };
    fetchPost();
  });
  }
};

renderApp();


//   // Кнопка Enter
//   window.addEventListener('keyup', () => {
//       if (event.key === 'Enter') {
//       addCommentElement.click();
//       }
//   });