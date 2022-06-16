import {React, useState} from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";


import Button from '../components/basics/Button'
import Title from '../components/basics/Title'
import FormInput from '../components/basics/FormInput';


function LoginForm({className, onLogin, loading}) {
  // STATE
  const [username, setUsername] = useState('testuser');
  const [password, setPassword] = useState('password');

  // Navigate
  const navigate = useNavigate();

  // Form Handlers
  const updateUsername = (e) => {
    setUsername(e.target.value.trim())
  }

  const updatePassword = (e) => {
    setPassword(e.target.value)
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
          onClick={() => onLogin({username, password})} 
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