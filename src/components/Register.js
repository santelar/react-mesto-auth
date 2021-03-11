import React from 'react';
import { Link, useHistory } from 'react-router-dom'; 

function Register(props) {

  const [inputEmail, setInputEmail] = React.useState('');
  const [inputPassword, setInputPassword] = React.useState('');
  const history = useHistory();

  function handleSubmit(e) {
    e.preventDefault();
    props.handleRegister(inputEmail, inputPassword)
    setInputEmail('');
    setInputPassword('');
  }

  function handleChangeEmail(e) {
    setInputEmail(e.target.value);
  }

  function handleChangePassword(e) {
    setInputPassword(e.target.value)
  }

  function handleClick(e) {
    history.push('/sign-in');
  }

  return (
    <section className="register">
        <h2 className="register__title">Регистрация</h2>
        <form className="register__form" onSubmit={handleSubmit} name="form-element">
            <input className="register__input" type="email" name="email" id="email" required placeholder="Email" value={inputEmail} onChange={handleChangeEmail} />
            <input className="register__input" type="password" name="password" id="password" required placeholder="Пароль" value={inputPassword} onChange={handleChangePassword} /> 
            <button className="register__submit" type="submit">Зарегистрироваться</button>
        </form>
        <Link to="/sign-in" className="register__link" onClick={handleClick}>Уже зарегистрированы? Войти</Link>
    </section>
  );
}

export default Register;