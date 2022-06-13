import {React, useEffect} from 'react'
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";


import Title from '../components/basics/Title';
import LoginForm from '../components/LoginForm';


function LoginPage({isLogged, login}) {

  const navigate = useNavigate();

  useEffect(() => {
    if (isLogged){
      navigate('/');
    }
  }, [navigate, isLogged])

  return (
    <div>
      <Title
        className='mt-10 mx-32'
        value='Login with you Credentials'
      />
      {/* 
        *   Login Form Card
        */}
      <LoginForm 
        className='m-auto p-32'
        onLogin={login}
        validCredentials={true} // TODO -> Gestisci Errore credenziali
      />
    </div>
  )
}

LoginPage.propTypes = {
  isLogged: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
}

export default LoginPage
