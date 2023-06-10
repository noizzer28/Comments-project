"use strict";

import { getComments, postComments, failedServer, likeApi, failedInput, deleteApi } from "./modules/api.js";
import { renderComments, renderLogin, renderPage } from "./modules/renderForms.js";


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
let userName
let userImage

function tokenToNull () {
  token = null;
  }

tokenToNull();



function localStorageData() {
  if (localStorage.getItem("userData")) {
    let userData = localStorage.getItem("userData");
    let user = JSON.parse(userData);
    token = user.token;
    userName = user.name;
    userImage = user.imageUser;
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
  const commentsHtml = renderComments(comments, token)
  const appElement = document.getElementById("app");

  if (!token) {
    renderLogin({isLoginMode, 
      appElement, 
      commentsHtml,
      renderApp,
    })
    return
  } else {
    const appHTML = renderPage(userImage, userName, commentsHtml)
    appElement.innerHTML = appHTML;
    const commentElement = document.getElementById("comment-input");

    document.getElementById("exit").addEventListener("click", () => {
      localStorage.clear();
      tokenToNull();
      fetchGet();
    })
    
    //   Обработчик лайков
    const likeCountButtonListener = () => {
        const likeButtonElements = document.querySelectorAll(".like-button");
        for (const likeButtonElement of likeButtonElements) {
        likeButtonElement.addEventListener("click", () => {
            let id = likeButtonElement.dataset.id;
            likeButtonElement.classList.add('-loading-like')
            fetchGet();
            likeApi({id, token}).then(() => {
            fetchGet();
            })

   
        });
        }
    };
    likeCountButtonListener();

    const deleteButtonListener = () => {
      const deleteButtonElements = document.querySelectorAll('.delete-button');
      for (const deleteButtonElement of deleteButtonElements) {
        deleteButtonElement.addEventListener('click', () => {
          let id = deleteButtonElement.dataset.id;
          deleteApi({id, token}).then(() => {
            fetchGet();
          })

        })
        
      }
    }

    deleteButtonListener();
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
          } else if (error.message == "Failed to fetch"){
            addCommentElement.disabled = false;
            addCommentElement.textContent = "Попробуй еще раз";
            alert("Проверьте интернет-соединение");
          } else if (error.message == failedInput){
            addCommentElement.disabled = false;
            addCommentElement.textContent = "Попробуй еще раз";
            alert(failedInput);
          } else {
            addCommentElement.disabled = false;
            addCommentElement.textContent = "Попробуй еще раз";
            alert(error.message);
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
