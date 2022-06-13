import {React, useState} from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";


import Button from '../components/basics/Button' 


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
    setPassword(e.target.value.trim())
  }

  return (
    <div className={`${className}`}>
      {/* BODY */}
      <div className=' w-full bg-primary-100 flex flex-col'>
        <input type='text' onChange={updateUsername}></input>
        <input type='password' onChange={updatePassword}></input>
      </div>

      {/* FOOTER */}
      <div className='flex justify-between mt-6'>
        <Button label='Go Back' onClick={() => navigate('/')}/>
        <Button label='Login' onClick={() => onLogin({username, password})}/>
      </div>
    </div>
  )
}

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
  validCredentials: PropTypes.bool.isRequired
};


export default LoginForm