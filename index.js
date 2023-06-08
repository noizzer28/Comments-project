"use strict";
const commentsArea = document.getElementById("comments-area");
const nameElement = document.getElementById("name-input");
const commentElement = document.getElementById("comment-input");
const addCommentElement = document.getElementById("add-comment-button");
const removeCommentElement = document.getElementById("delete-comment-button");
const loadElement = document.getElementById("loading");


const host  = "https://wedev-api.sky.pro/api/v2/vikky/comments"
function formatDate(inputDate) {
  const commentDate = new Date(inputDate);
  const options = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };
  return commentDate.toLocaleDateString('ru-RU', options);
}
let comments = [];
function fetchComments() {
  return fetch(host,
    {
      method: "GET",
    })
  .then((response) => {
    return response.json()
  }).then((responseData) => {
      comments = responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: formatDate(comment.date),
          text: comment.text,
          likes: comment.likes,
          isLiked: comment.isLiked,
          isLikeLoading: comment.isLiked,
        }
      });
      loadElement.style.display = "none";
      renderComments();
    })
    .catch (() => {
      console.error("Failed to load, check your connection")
    })
};


fetchComments();
function delay(interval = 300) {
    return new Promise((resolve) => {
      
      setTimeout(() => {
        resolve();
      }, interval);
    });
  };
// Обработчик лайков
const likeCountButtonListener = () => {
  const likeButtonElements = document.querySelectorAll('.like-button');
  for (const likeButtonElement of likeButtonElements) {
    likeButtonElement.addEventListener('click', () => {
      event.stopPropagation();
      let index = likeButtonElement.dataset.index;
      comments[index].isLikeLoading = true;
      renderComments();
      delay(1000).then(() => {
        if (comments[index].isLiked == false) {
        comments[index].likes++;
        comments[index].isLiked = true;
      } else {
        comments[index].likes--;
        comments[index].isLiked = false;
      }
      comments[index].isLikeLoading = false;
      renderComments();
      })
    })
  }
}
likeCountButtonListener();
// Ответ на комментарий
const replyCommentsListener = () => {
  const replyButtonElements = document.querySelectorAll('.comment');
  for (const replyButtonElement of replyButtonElements) {
    replyButtonElement.addEventListener('click', () => {
      let index = replyButtonElement.dataset.index;
      commentElement.value = `Quote_start${comments[index].name}: New_line ${comments[index].comment} Quote_end`
      renderComments();
    })
  }
}
replyCommentsListener();
// Рендер комментариев в HTML
const renderComments = () => {
  const commentsHtml = comments.map((comment, index) => {
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
             <button data-index="${index}" id="likes-button" class="like-button ${comment.isLiked ? "-active-like" : ""} ${comment.isLikeLoading ? "-loading-like" : ""}"></button>
           </div>
         </div>
       </li>`
  }).join('');
  commentsArea.innerHTML = commentsHtml;
  likeCountButtonListener();
  replyCommentsListener();
}
renderComments();



// Выключает кнопку при пустых инпутах
window.addEventListener('input', () => {
  if (commentElement.value === "") {
    addCommentElement.disabled = true;
  } 
});


// Кнопка Enter
window.addEventListener('keyup', () => {
  if (event.key === 'Enter') {
    addCommentElement.click();
  }
});


// Отправка комментариев
addCommentElement.addEventListener("click", () => {
  commentElement.classList.remove("validation");
  if (commentElement.value == "") {
    commentElement.classList.add("validation");
    return;
  } 

  addCommentElement.disabled = true;
  addCommentElement.textContent = "Данные загружаются..."
  const failedServer = "Сервер сломался, попробуй позже"
  const failedInput = "В поле ввода должно быть минимум три символа"
  const fetchPost = (() => {
    fetch(
    host,
    {
      method: "POST",
      body: JSON.stringify({
        text: commentElement.value,
      }),
      headers: {
        Authorization: "Bearer c8ccbodkdkb8co6gckd8b8cocwdg5g5k5o6g38o3co3cc3co3d03co3bc3b43k37s3c03c83d43co3cw3c03ek",
      },
    })
    .then((response) => {
      console.log(response);
      if (response.status === 201) {
        return response.json();
      } else if (response.status === 500) {
        return Promise.reject(new Error(failedServer));
      } else {
        return Promise.reject(new Error(failedInput));
      }
    })
    .then((responseJson) => {
      console.log(responseJson);
      addCommentElement.disabled = false;
      addCommentElement.textContent = "Отправить"
      fetchComments();
      commentElement.value = "";
    })
    .catch((error) => {
        console.log(error);
      if (error.message == failedServer) {
        alert(error);
        fetchPost();
      } else if (error.message == failedInput){
        addCommentElement.disabled = false;
        addCommentElement.textContent = "Попробуй еще раз"
        alert(error);
      } else {
        addCommentElement.disabled = false;
        addCommentElement.textContent = "Попробуй еще раз"
        alert("Кажется, у вас сломался интернет, попробуйте позже");
      }
    })
  });
  fetchPost();
});