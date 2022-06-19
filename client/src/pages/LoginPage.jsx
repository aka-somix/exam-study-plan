import {React, useEffect} from 'react'
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";


import Title from '../components/basics/Title';
import LoginForm from '../components/LoginForm';
import ErrorBanner from '../components/ErrorBanner';


function LoginPage({isLogged, login, loginError, loading}) {

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

      {
        loginError.message && 
        <ErrorBanner 
          className='mx-32'
          message={loginError.message.toString()}
        />
      }

      {/* 
        *   Login Form Card
        */}
      <LoginForm 
        className='mx-16 py-10 px-32'
        onLogin={login}
        loading={loading}
      />
    </div>
  )
}

LoginPage.propTypes = {
  isLogged: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
  loginError: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
}

export default LoginPage
