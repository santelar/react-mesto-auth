import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Card from './Card';

import load from '../images/editAvatar.svg';
import profileEdit from '../images/profile__edit.svg';
import buttonPlus from '../images/add-button__plus.svg';

function Main({ 
  onEditAvatar,
  onEditProfile,
  onAddPlace,
  onCardClick,
  cards,
  onCardLike,
  onCardDelete }) {

  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__avatar-container">
          <img src={currentUser.avatar} alt="Аватар" className="profile__avatar" />
          <img src={load} alt="Редактирование аватара" onClick={onEditAvatar} className="profile__avatar-load" />
        </div>
        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <button type="button" onClick={onEditProfile} className="button"><img src={profileEdit} alt="Изм."
            className="profile__edit" /></button>
          <p className="profile__description">{currentUser.about}</p>
        </div>
        <button type="button" className="button button_add_card"><img src={buttonPlus} alt="Добавить"
          onClick={onAddPlace} className="profile__add-button" /></button>
      </section>

      <section className="elements">
        {
          cards.map((card) => {
            return (
              <Card
                card={card}
                key={card._id}
                onCardClick={onCardClick}
                onCardLike={onCardLike}
                onCardDelete={onCardDelete}
              />
            );
          })
        }
      </section>
    </main>
  );
}

export default Main;