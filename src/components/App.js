import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import '../index.css';
import Header from './Header';
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
import auth from '../utils/auth';

function App() {

  // Хуки для данных о пользователе //
  const [currentUser, setСurrentUser] = useState('');
  useEffect(() => {
    api.getUserInfo()
      .then(res => {
        setСurrentUser(res)
      })
      .catch((error) => console.error(error))
  }, []);

  // Хуки для получения карточек //
  const [cards, setCards] = useState([]);
  useEffect(() => {
    api.getInitialCards()
      .then(res => {
        setCards(res)
      })
      .catch((error) => console.error(error))
  }, []);

  // Хуки состояния и пр. //
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = React.useState('');
  const history = useHistory();

  // Аутентификация (register/login) и авторизация //
  function onRegister(email, password) {
    auth.register(email, password)
      .then(() => {
        history.push('/sign-in');
        //infoToolSuccess();
      })
      .catch((err) => {
        console.log(err);
        //infoToolFail();//
      })
  }
  function onLogin(mail, password) {
    auth.login(mail, password)
      .then((res) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          tokenCheck();
          history.push("/")
        }
      })
      .catch((err) => {
        console.log(err);
        //infoToolFail();//
      })
  }
  const tokenCheck = React.useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      auth.getContent(token)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            setUserEmail(res.data.email);
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }, [history]);

  // Функция для состояния попапа //
  function handleCardClick(props) {
    setSelectedCard(props);
  }

  // Открытие попапов //
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  // Закрытие попапов //
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
  }

  /////////////////////////////////////////////////////////////////
  ///////////////////// Запросы через Api /////////////////////////
  /////////////////////////////////////////////////////////////////

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
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Редактирование профиля - вызов api запроса //
  function handleUpdateUser(data) {
    api.editUserInfo(data)
      .then((res) => {
        setСurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Изменение аватара - вызов api запроса //
  function handleUpdateAvatar(image) {
    console.log(image);
    api.editUserPic(image)
      .then((image) => {
        setСurrentUser(image);
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
    <div className="root">
      <CurrentUserContext.Provider
        value={currentUser}>
        
        <Header />
        <InfoTooltip />
        <Switch>
          <Route exact path="/sign-up">
            <div className="registerContainer">
              <Register handleRegister={onRegister} />
            </div>
          </Route>
          <Route exact path="/sign-in">
            <div className="loginContainer">
              <Login handleLogin={onLogin} />
            </div>
          </Route>
          <ProtectedRoute exact path="/"
              isLoggedIn={loggedIn}
              component={Main}
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
          />
        </Switch>
        
        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <PopupWithForm
          name="confirm"
          title="Вы уверены?"
          onClose={closeAllPopups}
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
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;