import {React, useState} from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";


import Button from '../components/basics/Button'
import Title from '../components/basics/Title'
import FormInput from '../components/basics/FormInput';


function LoginForm({className, onLogin, loading}) {
  // STATE
  const [username, setUsername] = useState('testuser');
  const [valid, setValid] = useState(true);

  const [password, setPassword] = useState('password');

  // Navigate
  const navigate = useNavigate();

  // Form Handlers
  const updateUsername = (e) => {
    const value = e.target.value.trim();
    setUsername(value);
  }

  const updatePassword = (e) => {
    setPassword(e.target.value)
  }

  const submitLogin = () => {
    const validUsernameRegexp = /^([a-z]|[0-9]){4,20}$/g;

    if(validUsernameRegexp.test(username)){
      setValid(true);
      onLogin({username, password});
    }
    else {
      setValid(false);
    }

  }

  return (
    <div className={`${className}`}>
      {/* BODY */}
      <div className=' w-full flex flex-col'>
        <Title value="Username:"/>
        <FormInput
          type='text'
          value={username}
          onChange={updateUsername}
        />
        {
        !valid&&
        <div className='text-error-200'>
          Username cannot have spaces or special characters and must be between 4 and 20 characters
        </div>
        }

        <Title value="Password:"/>
        <FormInput
          type='password'
          value={password}
          onChange={updatePassword}
        />
      </div>

      {/* FOOTER */}
      <div className='flex lg:justify-end justify-center mt-6'>
        <Button 
          className='mx-4'
          label='Go Back'
          disabled={loading}
          onClick={() => navigate('/')} 
        />
        <Button 
          className='mx-4'
          label='Login'
          disabled={loading}
          onClick={submitLogin}
        />
      </div>
    </div>
  )
}

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};


export default LoginForm