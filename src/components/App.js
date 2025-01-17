import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch, useHistory, withRouter } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Main from './Main';
import ProtectedRoute from './ProtectedRoute';
import Footer from './Footer';
import InfoTooltip from './InfoTooltip';
import EditProfilePopup from './EditProfilePopup';
import AddPlacePopup from './AddPlacePopup';
import EditAvatarPopup from './EditAvatarPopup';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import api from '../utils/api';
import { register, login, getContent } from '../utils/auth';

function App() {

  // Хуки состояния и пр. //
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({ isOpen: false, link: "", name: "" });
  const [currentUser, setCurrentUser] = useState(' ');
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAuthSuccess, setIsAuthSuccess] = useState(false);
  const [loginData, setLoginData] = useState({
    _id: '',
    email: ''
  })

  const history = useHistory();

  ///////////////////////////////////////////////////////////
  ///// Регистрация / авторизация / выход ///////////////////
  ///////////////////////////////////////////////////////////

  const handleRegister = (data) => {
    const { email, password } = data;
    return register(email, password)
      .then((res) => {
        if (res.data) {
          setIsAuthSuccess(true);
          openInfoTooltip();
        }
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
        setIsAuthSuccess(false);
        openInfoTooltip();
        history.push('/sign-up');
      })
  }

  const handleLogin = (data) => {
    const { email, password } = data;
    return login(email, password)
      .then((res) => {
        if (res.token) {
          setLoggedIn(true);
          setIsAuthSuccess(true);
          history.push('/')
          localStorage.setItem('jwt', res.token);
        }
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
        setIsInfoTooltipOpen(true);
      })
  }

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      getContent(jwt)
        .then((res) => {
          setLoggedIn(true);
          setLoginData(res.data);

        })
        .catch((err) => {
          console.log(`Ошибка: ${err}`);
          setIsInfoTooltipOpen(true);
        })
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    setIsAuthSuccess(false);
  }

  /////////////////////////////////////////////////////
  ////////  Хендлеры переключения стейтов /////////////
  /////////////////////////////////////////////////////
  // Функция для состояния попапа //
  function handleCardClick(card) {
    const { link, name } = card;
    setSelectedCard({ isOpen: true, link: link, name: name });
    document.addEventListener('keydown', handleEscClose);
  }

  // Открытие попапов //
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
    document.addEventListener('keydown', handleEscClose);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
    document.addEventListener('keydown', handleEscClose);
  }

  // Работа инфоокна // 
  function openInfoTooltip() {
    setIsInfoTooltipOpen(!isInfoTooltipOpen);
  }

  function closeInfoTooltip() {
    setIsInfoTooltipOpen(false);
    if (isAuthSuccess) {
      history.push('/sign-in');
    }
  }

  // Закрытие попапов //
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({ isOpen: false, link: "", name: "" });
    setIsInfoTooltipOpen(false);
    document.removeEventListener('keydown', handleEscClose);
  }
  function handleClickOverlay(evt) {
    if (evt.target.classList.contains('popup_opened')) {
      closeAllPopups();
    }
  }
  function handleEscClose(evt) {
    if (evt.key === 'Escape') {
      closeAllPopups();
    }
  }



  /////////////////////////////////////////////////////////////////
  ///////////////////// Запросы через Api /////////////////////////
  /////////////////////////////////////////////////////////////////

  // Получение инфо о пользователе и массива карточек //
  useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([userData, cards]) => {
        setCurrentUser(userData);
        setCards(cards);
      })
      .catch((err) => console.log(`Что-то пошло не так: ${err}`))
  }, []);

  useEffect(() => {
    if (loggedIn) {
      history.push('/');
    }
  }, [history, loggedIn])

  // Лайки карточки - проверка id, вызов api запроса //
  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        const newCards = cards.map((c) => c._id === card._id ? newCard : c);
        setCards(newCards);
      })
      .catch((error) => console.error(error));
  }

  // Удаление карточки - проверка id, вызов api запроса //
  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        const newCards = cards.filter((c) => c._id !== card._id);
        setCards(newCards);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Редактирование профиля - вызов api запроса //
  function handleUpdateUser(data) {
    api.editUserInfo(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Изменение аватара - вызов api запроса //
  function handleUpdateAvatar(image) {
    api.editUserPic(image)
      .then((image) => {
        setCurrentUser(image);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Добавление карточки - вызов api запроса //
  function handleAddPlaceSubmit(newCard) {
    api.addCard(newCard)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        setIsAddPlacePopupOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  ////////////////////////////////////////////////////////////

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">

        <Switch>
          <ProtectedRoute exact path="/"
            loggedIn={loggedIn}
            component={Main}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            signOut={handleSignOut}
            loginData={loginData.email}
          />
          <Route path="/sign-in">
            <Login handleLogin={handleLogin} />
          </Route>
          <Route path="/sign-up">
            <Register handleRegister={handleRegister} />
          </Route>
        </Switch>

        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          onClickOverlay={handleClickOverlay}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          onClickOverlay={handleClickOverlay}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          onClickOverlay={handleClickOverlay}
        />
        <PopupWithForm
          name="confirm"
          title="Вы уверены?"
          onClose={closeAllPopups}
          onClickOverlay={handleClickOverlay}
        >
          <button
            type="submit"
            className="popup__save">
            Да
          </button>
        </PopupWithForm>
        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
          onClickOverlay={handleClickOverlay}
        />
        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeInfoTooltip}
          isAuthSuccess={isAuthSuccess}
          goodRegister="Вы успешно зарегестрировались!"
          badRegister="Что-то пошло не так! Попробуйте ещё раз."
        />
      </div>
    </CurrentUserContext.Provider>

  );
}

export default withRouter(App);