class Api {
  constructor(config) {
    this._url = config.baseUrl;
    this._headers = config.headers;
    this._cardsUrl = config.cardsUrl;
    this._likesUrl = config.likesUrl;
    this._usersUrl = config.usersUrl;
    this._userUrl = config.userUrl;
    this._avatarUrl = config.avatarUrl;
    this._check = (res) => {
      if (res.ok) { return res.json() }
      return Promise.reject(`Error: ${res.status}`)
    }
  }

  // Получить массив карточек с сервера //
  getInitialCards() {
    return fetch(`${this._url}${this._cardsUrl}`, {
      method: 'GET',
      headers: this._headers,
    })
      .then(this._check);
  };

  // Добавить карточку на сервер //
  addCard(data) {
    return fetch(`${this._url}${this._cardsUrl}`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        link: data.link
      })
    })
      .then(this._check);
  };

  // Получить данные пользователя //
  getUserInfo() {
    return fetch(`${this._url}${this._usersUrl}${this._userUrl}`, {
      method: 'GET',
      headers: this._headers,
    })
      .then(this._check);
  }

  // Изменить данные пользователя //
  editUserInfo(data) {
    return fetch(`${this._url}${this._usersUrl}${this._userUrl}`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        about: data.about
      })
    })
      .then(this._check);
  }

  // Изменить аватар //
  editUserPic(image) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(image)
    })
      .then(this._check);
  }

  // Удалить карточку //
  deleteCard(cardId) {
    return fetch(`${this._url}${this._cardsUrl}/${cardId}`, {
      method: 'DELETE',
      headers: this._headers,
    })
      .then(this._check);
  }

  // Поставить/снять лайк //
    changeLikeCardStatus(cardId, isLiked) {
    return fetch(`${this._url}${this._cardsUrl}/likes/${cardId}`, {
      method: isLiked ? 'PUT' : 'DELETE',
      headers: this._headers
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        return Promise.reject(`Ошибка: ${res.status}`);
      });
  }

}

// Api - идентификация //
const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-18',
  cardsUrl: '/cards',
  usersUrl: '/users',
  userUrl: '/me',
  avatarUrl: '/me/avatar',
  headers: {
    authorization: 'eaa08385-02d1-499c-a13e-a2b5f60e8932',
    'Content-Type': 'application/json'
  }
});

export default api;