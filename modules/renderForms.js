import { loginApi, regApi } from "./api.js";
import { fetchGet } from "../index.js";


export function renderComments(comments, userImage) {
    const newArray =  comments.map((comment, index) => {
        return `<li class="comment" data-index="${index}">
        <div class="comment-header">
          <div>${comment.name}</div>
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
            <button data-id="${comment.id}" data-index="${index}" id="likes-button" class="like-button 
            ${comment.isLiked ? "-active-like" : ""} ${comment.isLikeLoading ? "-loading-like" : ""}">
            </button>
          </div>
        </div>
      </li>`
      }).join('');   
      return newArray;
};


export function renderLogin({isLoginMode, appElement, commentsHtml, renderApp}) {
        const appHtml = `  
            <div class="container">
                <div id="loading">Подождите, комментарии загружаются...
                </div>
                <ul class="comments" id="comments-area">
                ${commentsHtml}
                </ul>
            <br>
            <div>
            Чтобы оставлять коментарии <span id="login-link" class="auth-link">войдите в систему</span>
            </div>
        </div>`;
        appElement.innerHTML = appHtml;

    const loadElement = document.getElementById("loading");
    loadElement.style.display = "none";

    document.getElementById("login-link").addEventListener("click", () => {
        toggleLoginForm();
        function toggleLoginForm() {
            const appHtml = `<div class="container">       
            <div class="add-form" id="inputs">
            Форма ${isLoginMode ? "регистрации" : "входа"}
            <br>
            <br>
            ${isLoginMode ? 
                `<input type="textarea" placeholder="Введите имя" class="add-form-text"
                id="name-input"></input>
            <br>`: ''}
                <input type="textarea" placeholder="Введите логин" class="add-form-text"
                id="login-input"></input>
                <br>
                <input type="password" placeholder="Введите пароль" class="add-form-text"
                id="password-input"></input>
            <div class="add-form-row">
            <button class="add-form-button" id="login-button">${isLoginMode ? `
            Зарегистрироваться`:`Войти`}</button>
            </div>
        </div>
        <br>
        <div id="toggle-button" class="auth-link">${isLoginMode ? "Перейти ко входу" : "Перейти к регистрации"}</div>
        </div>`
            appElement.innerHTML = appHtml;
            window.scrollTo(0, 0);

            document.getElementById("toggle-button").addEventListener("click", () => {
            isLoginMode = !isLoginMode;
            toggleLoginForm();
            })

            if (!isLoginMode) {
                  document.getElementById('login-button').addEventListener("click", () => {
                    const login = document.getElementById("login-input").value
                    const password = document.getElementById("password-input").value
                    if (login == "" || password == "") {
                        alert("Введите данные")
                        return;
                    }
                    loginApi({                  
                        login,
                        password,
                    }).then ((user) => {
                        const userData = {
                            name: user.user.name,
                            token: `Bearer: ${user.user.token}`,
                            imageUser: user.user.imageUrl,
                        }
                        localStorage.setItem("userData", JSON.stringify(userData));
                        fetchGet();
                    }).catch ((error) => {
                        alert(error.message);
                    })
                })
            } else {
                document.getElementById('login-button').addEventListener("click", () => {
                    const login = document.getElementById("login-input").value
                    const password = document.getElementById("password-input").value
                    const name = document.getElementById("name-input").value
                    if (login == "" || password == "" || name == "") {
                        alert("Введите данные")
                        return;
                    }
                    regApi({                  
                        name,
                        login,
                        password,
                    }).then ((user) => {
                        const userData = {
                            name: user.user.name,
                            token: `Bearer: ${user.user.token}`,
                            image: user.user.imageURL,
                        }
                        localStorage.setItem("userData", JSON.stringify(userData));
                        renderApp()
                    }).catch ((error) => {
                        alert(error.message)
                    }) 
                })
            }
        }
  })
}


export function renderPage(userImage, userName, commentsHtml) {
    return `  <div class="container">
    <div id="loading">Подождите, комментарии загружаются...</div>
    <ul class="comments" id="comments-area">
    ${commentsHtml}
    </ul>
    <div class="add-form" id="inputs">
    <div class="add-flex">
    <img class="userImage" src=${userImage} alt="no"></img>
    <input type="textarea" class="add-form-text add-name" placeholder='${userName}'
    id="name-input" disabled></input>
    </div>
    <textarea type="textarea" class="add-form-text name" placeholder="Введите ваш коментарий" rows="4"
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
}


