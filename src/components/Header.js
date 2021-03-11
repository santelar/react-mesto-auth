import React from 'react';
import { NavLink } from 'react-router-dom';
import headerLogo from '../images/header__logo.svg';

function Header() {
  return (
    <header className="header">
      <img src={headerLogo} alt="Лого" className="header__logo" />
      <NavLink exact to="/" className="header__button">Выйти</NavLink>
      <NavLink to="/sign-in" className="header__button">Зарегистрироваться</NavLink>
      <NavLink to="/sign-up" className="header__button">Войти</NavLink>
    </header>
  );
}

export default Header;