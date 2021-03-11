import React, { useEffect, useContext } from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup(props) {

  const currentUser = useContext(CurrentUserContext);

  // Изменение состояния имени/описания //
  const [name, setName] = React.useState(currentUser.name);
  function handleNameChange(evt) {
    setName(evt.target.value);
  }

  const [description, setDescription] = React.useState(currentUser.about);
  function handleDescriptionChange(evt) {
    setDescription(evt.target.value);
  }

  // Хук на обновление профиля при изменении контекста //
  useEffect(() => {
    if (!props.isOpen) {
      setName(currentUser.name);
      setDescription(currentUser.about);
    }
  }, [currentUser, props]);

  // Сабмит формы профиля //
  function handleSubmit(evt) {
    evt.preventDefault();
    props.onUpdateUser({
      name,
      about: description,
    });
  } 

  return (
    <PopupWithForm
      name="user"
      title="Редактировать профиль"
      {...props}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        required
        autoComplete="off"
        minLength="2"
        maxLength="40"
        placeholder="Имя"
        className="popup__input popup__input_name popup__input_name-profile"
        id="name"
        name="name"
        value={name || ''}
        onChange={handleNameChange}
      />
      <span
        id="name-error"
         className="error">
      </span>
      <input
        type="text"
        required autoComplete="off"
        minLength="2" maxLength="200"
        placeholder="Род деятельности"
        className="popup__input popup__input_description popup__input_description-profile"
        id="job"
        name="info"
        value={description || ''}
        onChange={handleDescriptionChange}
      />
      <span
        id="job-error"
        className="error">
      </span>
      <button
        type="submit"
        className="popup__save">
        Сохранить
      </button>
    </PopupWithForm>
  );

}

export default EditProfilePopup;