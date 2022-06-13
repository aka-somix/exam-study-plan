import {React, useState} from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";


import Button from '../components/basics/Button'
import Title from '../components/basics/Title'
import FormInput from '../components/basics/FormInput';


function LoginForm({className, onLogin, validCredentials}) {
  // STATE
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
          type='text' onChange={updateUsername}
        />
        <Title value="Password:"/>
        <FormInput
          type='password' onChange={updatePassword}
        />
      </div>

      {/* FOOTER */}
      <div className='flex lg:justify-end justify-center mt-6'>
        <Button label='Go Back' onClick={() => navigate('/')} className='mx-4'/>
        <Button label='Login' onClick={() => onLogin({username, password})} className='mx-4'/>
      </div>
    </div>
  )
}

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
  validCredentials: PropTypes.bool.isRequired
};


export default LoginForm