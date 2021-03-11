import React from 'react';
import { Link } from 'react-router-dom'; 

function Login() {
  return (
    <section className="login">
        <h2 className="login__title">Вход</h2>
        <form className="login__form">
            <input className="login__input" type="email" name="email" id="email" required placeholder="Email"/>
            <input className="login__input" type="password" name="password" id="password" required placeholder="Пароль"/> 
            <button className="login__submit" type="submit">Войти</button>
        </form>
        <Link to="/sign-up" className="login__link">Еще не зарегистрированы? Регистрация</Link>
    </section>
  );
}

export default Login;