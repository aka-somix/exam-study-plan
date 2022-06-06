import React from 'react'
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";


import AppLogo from './basics/AppLogo'
import Button from './basics/Button';

function Header({isLogged, username}) {

  const navigate = useNavigate();

  return (
    <div className='h-28 flex justify-between pt-4 pb-4 lg:mx-56 md:mx-24 mx-4'>
      <AppLogo className="mr-12"/>
      
      <div className='p-4'>
        {
          isLogged 
          ? (
              <h4 className='text-primary-200 font-sans text-xl'> 
                Benvenuto <u><b>{username}</b></u>
              </h4>
          ) 
          : (
            <Button label='Login' onClick={() => navigate('/login')}/>
          ) 
          
        }
      </div>
    </div>
  )
}

Header.propTypes = {
   isLogged: PropTypes.bool.isRequired,
   username: PropTypes.string,
}

Header.defaultProps = {
  username: '' 
}
export default Header
