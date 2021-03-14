import login from "../images/login.svg";
import loginErr from "../images/loginErr.svg";

export default function InfoTooltip({ isOpen, onClose, isAuthSuccess }) {
    return (
        <section className={`${isOpen ? "popup_opened" : ""} popup`}>
            <div className="popup__container popup__container_login">
            <button className="popup__close" aria-label="Закрыть" onClick={onClose}></button>
                <img className="popup__image-login" alt="info" src={`${isAuthSuccess ? login : loginErr}`}/>
                <p className="popup__text-login">{`${isAuthSuccess ? "Вы успешно зарегестрировались" : "Что-то пошло не так! Попробуйте ещё раз."}`}</p>
            </div>
        </section>
    )}
