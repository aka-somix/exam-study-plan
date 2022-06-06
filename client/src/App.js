import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';

function App() {
  return (
    <div className="bg-background-100 h-screen w-screen min-w-max overflow-hidden">
      <BrowserRouter>
        <Header isLogged={false} username={"Somix"} />
        <div className='container lg:mx-56 md:mx-24 mx-4'>
          <Routes>
            <Route exact path='/' element={<HomePage />}></Route>
            <Route exact path='/login' element={<LoginPage />}></Route>
            <Route path='*' element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
