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
let token
  function tokenToNull () {
  token = null;
  }
tokenToNull();
let userName
function localStorageData() {
  if (localStorage.getItem("userData")) {
    let userData = localStorage.getItem("userData");
    let user = JSON.parse(userData);
    token = user.token;
    userName = user.name;
  } else {
    token = null;
  }
}
localStorageData();
fetchGet();

export function fetchGet() {
  localStorageData();
  return getComments({token}).then((responseData) => {
      comments = responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: formatDate(comment.date),
          text: comment.text,
          likes: comment.likes,
          isLiked: comment.isLiked,
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


const renderApp = () => {
  const commentsHtml = renderComments(comments);
  const appElement = document.getElementById("app");

  if (!token) {
    renderLogin({isLoginMode, 
      appElement, 
      commentsHtml,
      renderApp,
    });
    return
  } else {
      const appHtml = `  <div class="container">
        <div id="loading">Подождите, комментарии загружаются...</div>
        <ul class="comments" id="comments-area">
        ${commentsHtml}
        </ul>
        <div class="add-form" id="inputs">
        <input type="textarea" class="add-form-text" placeholder='${userName}'
        id="name-input" disabled></input>
        <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4"
        id="comment-input"></textarea>
        <div class="add-form-row">
        <button class="add-form-button" id="add-comment-button">
            Написать
        </button>
        </div>
        </div>
        <br>
        <div id="exit" class="auth-link">Выйти из аккаунта</div>
        </div>`;
    appElement.innerHTML = appHtml;
    const commentElement = document.getElementById("comment-input");

    document.getElementById("exit").addEventListener("click", () => {
      localStorage.clear();
      tokenToNull();
      fetchGet();
    })


    const loadElement = document.getElementById("loading");
    loadElement.style.display = "none";
    
    //   Обработчик лайков
    const likeCountButtonListener = () => {
        const likeButtonElements = document.querySelectorAll(".like-button");
        for (const likeButtonElement of likeButtonElements) {
        likeButtonElement.addEventListener("click", () => {
            console.log(likeButtonElement);
            let index = likeButtonElement.dataset.index;
            let id = likeButtonElement.dataset.id;
            likeButtonElement.classList.add('-loading-like')
            fetchGet();
            likeApi({id, token}).then((response) => {
              console.log(response);
              comments[index].isLikeLoading = false;
            fetchGet();
            })

   
        });
        }
    };
    likeCountButtonListener();

        
  const addCommentElement = document.getElementById("add-comment-button");
  window.addEventListener('keyup', () => {
    if (event.key === 'Enter') {
    addCommentElement.click();
    }
  })
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
