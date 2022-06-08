import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';

const { useState } = require('react');

function App() {

  const [courses, setCourses] = useState([
    {
      code: 0,
      name: "Corso di Test",
      credits: 10,
      students: 0,
      maxStudents: 10
    },
    {
      code: 1,
      name: "Corso di Test 2",
      credits: 10,
      maxStudents: 25
    },
    {
      code: 2,
      name: "Corso di Test 3",
      credits: 10,
      students: 5,
    }
  ]);

  return (
    <div className="bg-background-100 min-h-screen min-w-max">
      <BrowserRouter>
        <Header isLogged={false} username={"Somix"} />
        <div className='lg:mx-56 md:mx-24 mx-4'>
          <Routes>
            <Route exact path='/' element={<HomePage courses={courses} />}></Route>
            <Route exact path='/login' element={<LoginPage />}></Route>
            <Route path='*' element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
