import { loginApi, regApi } from "./api.js";


export function renderComments(comments) {
    const newArray =  comments.map((comment, index) => {
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
            ${comment.isLiked ? "-active-like" : ""} ${comment.isLikeLoading ? "-loading-like" : ""}">
            </button>
          </div>
        </div>
      </li>`
      }).join('');   
      return newArray;
};

export function renderLogin({isLoginMode, appElement, commentsHtml, setToken, renderApp}) {
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
                `<textarea type="textarea" placeholder="Введите имя" class="add-form-text"
                id="name-input"></textarea>
            <br>`: ''}
                <textarea type="textarea" placeholder="Введите логин" class="add-form-text"
                id="login-input"></textarea>
                <br>
                <textarea type="password" placeholder="Введите пароль" class="add-form-text"
                id="password-input"></textarea>
            <div class="add-form-row">
            <button class="add-form-button" id="login-button">${isLoginMode ? `
            Зарегистрироваться`:`Войти`}</button>
            </div>
        </div>
        <br>
        <div id="toggle-button" class="auth-link">${isLoginMode ? "Перейти ко входу" : "Перейти к регистрации"}</div>
        </div>`
            appElement.innerHTML = appHtml;

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
                        console.log(user.user.name);
                        setToken(`Bearer ${user.user.token}`);
                        // setUserName(user.user.name);
                        renderApp()
                    }).catch ((error) => {
                        alert(error.message)
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
                        setToken(`Bearer ${user.user.token}`)
                        renderApp()
                    }).catch ((error) => {
                        alert(error.message)
                    }) 
                })
            }
        }
  })
}
 


