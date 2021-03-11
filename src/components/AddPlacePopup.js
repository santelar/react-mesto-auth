import React from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup(props) {

    const placeRef = React.useRef();
    const urlRef = React.useRef();

    function handleSubmit(evt) {
        evt.preventDefault();
        props.onAddPlace({
            name: placeRef.current.value,
            link: urlRef.current.value
        });
    }

    return (
        <PopupWithForm
            name="place"
            title="Новое место"
            {...props}
            onSubmit={handleSubmit}
        >
            <input
                ref={placeRef}
                type="text"
                required
                autoComplete="off"
                minLength="2"
                maxLength="30"
                placeholder="Название"
                className="popup__input popup__input_name popup__input_name-card"
                id="picName"
                name="name"
            />
            <span
                id="picName-error"
                className="error">
            </span>
            <input
                ref={urlRef}
                type="url"
                required
                autoComplete="off"
                placeholder="Ссылка на картинку"
                className="popup__input popup__input_description popup__input_url-card"
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
                Создать
            </button>
        </PopupWithForm>
    )
}

export default AddPlacePopup;