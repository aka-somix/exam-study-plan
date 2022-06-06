import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Header from './components/organisms/Header';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <div className='container'>
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
