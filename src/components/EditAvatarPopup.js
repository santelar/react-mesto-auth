import React from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup({...props}) {

    const avatarRef = React.useRef('');

    function handleSubmit(evt) {
        evt.preventDefault();
        props.onUpdateAvatar({
            avatar: avatarRef.current.value
        });
    }


    return (
        <PopupWithForm
            name="avatar"
            title="Обновить аватар"
            {...props}
            onSubmit={handleSubmit}
        >
            <input
                ref={avatarRef}
                type="url"
                required
                autoComplete="off"
                placeholder="Ссылка на аватар"
                className="popup__input popup__input_name popup__input_name-avatar"
                id="picLink"
                name="link"
            />
            <span
                id="picLink-error"
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

export default EditAvatarPopup;