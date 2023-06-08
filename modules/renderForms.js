
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

export function renderLogin(isLoginMode) {
    return `<div class="container">       
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
    ${isLoginMode ? `
    <button class="add-form-button" id="auth-button">
    Зарегистрироваться </button>` 
    : `            
    <button class="add-form-button" id="login-button">Войти
    </button>
    `}
    </div>
</div>
<br>
<div id="toggle-button" class="auth-link">${isLoginMode ? "Перейти ко входу" : "Перейти к регистрации"}</div>
</div>`
}
