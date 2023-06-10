"use strict";

import { getComments, postComments, failedServer, likeApi } from "./modules/api.js";
import { renderComments, renderLogin } from "./modules/renderForms.js";


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
let token = null;

fetchGet();

function fetchGet() {
  return getComments().then((responseData) => {
    console.log(responseData);
      comments = responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: formatDate(comment.date),
          text: comment.text,
          likes: comment.likes,
          isLiked: comment.isLiked,
          isLikeLoading: comment.isLiked,
          id: comment.id,
        };
      });
      renderApp();
    })
    .catch((error) => {
      console.error(error);
    });
}

let isLoginMode = false;
let userName
// Рендер комментариев в HTML
const renderApp = () => {
  console.log("reder");
  const commentsHtml = renderComments(comments);
  const appElement = document.getElementById("app");
  if (localStorage.getItem("userData")) {
    let userData = localStorage.getItem("userData");
    let user = JSON.parse(userData);
    token = user.token;
    userName = user.name;
  } else {
    token = null;
  }

  if (!token) {
    renderLogin({isLoginMode, 
      appElement, 
      commentsHtml,
      renderApp,
      setToken: (newToken) => {
        token = newToken;
      },
    });
    return
  } else {
      const appHtml = `  <div class="container">
        <div id="loading">Подождите, комментарии загружаются...</div>
        <ul class="comments" id="comments-area">
        ${commentsHtml}
        </ul>
        <div class="add-form" id="inputs">
        <textarea type="textarea" class="add-form-text" placeholder='${userName}'
        id="name-input" disabled></textarea>
        <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4"
        id="comment-input"></textarea>
        <div class="add-form-row">
        <button class="add-form-button" id="add-comment-button">
            Написать
        </button>
        </div>
        </div>
        <br>
        <div id="exit" class="auth-link">Сменить пользователя</div>
        </div>`;
    appElement.innerHTML = appHtml;
    const commentElement = document.getElementById("comment-input");

    document.getElementById("exit").addEventListener("click", () => {
      console.log("click");
      localStorage.clear();
      fetchGet();
    })


    const loadElement = document.getElementById("loading");
    loadElement.style.display = "none";
    
    //   Обработчик лайков
    const likeCountButtonListener = () => {
        const likeButtonElements = document.querySelectorAll(".like-button");
        for (const likeButtonElement of likeButtonElements) {
        likeButtonElement.addEventListener("click", () => {
            event.stopPropagation();
            let index = likeButtonElement.dataset.index;
            let id = likeButtonElement.dataset.id;
            comments[index].isLikeLoading = true;
            likeApi({id, token}).then((response) => {
              console.log(response);
            //   if (!comments[index].isLiked) {
            //     comments[index].likes++;
            //     comments[index].isLiked = true;
            //     } else {
            //     comments[index].likes--;
            //     comments[index].isLiked = false;
            // }
              // if (!response.result.isliked) {
              //   console.log("clik1")
              //   comments[index].likes++;
              //   comments[index].isLiked = true;
              //   renderApp()
              // } else {
              //   console.log("clik2")
              //   comments[index].likes--;
              //   comments[index].isLiked = false;
              //   renderApp()
              // }

            fetchGet();
            })
            comments[index].isLikeLoading = false;
            // renderApp()
   
        });
        }
    };
    likeCountButtonListener();

        
  const addCommentElement = document.getElementById("add-comment-button");
  addCommentElement.addEventListener("click", () => {
    commentElement.classList.remove("validation");
    if (commentElement.value == "") {
      commentElement.classList.add("validation");
      return;
    }
    addCommentElement.disabled = true;
    addCommentElement.textContent = "Данные загружаются...";

    const fetchPost = () => {
      postComments({
        text: commentElement.value, 
        token,
        }).then(() => {
          addCommentElement.disabled = false;
          addCommentElement.textContent = "Отправить";
          commentElement.value = "";
          fetchGet();
        })
        .catch((error) => {
          if (error.message == failedServer) {
            alert(error);
            fetchPost();
          } else {
            console.log(error.message);
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

// function delay(interval = 300) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, interval);
//   });
// }