import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';

const { useState, useEffect } = require('react');



const studyPlanService = require('./service/studyPlanService').default;

function App() {

  // Courses State representation
  const [courses, setCourses] = useState([]);

  // Fetch Data Error
  const [fetchError, setFetchError] = useState(false);

  // Initial Loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesFromDB = await studyPlanService.getAllCourses();
        setLoading(false);
        setCourses(coursesFromDB);
      }
      catch (error) {
        console.error(`Couldn't Retrieve Data from API due to: ${error} `);
        setFetchError(true);
      }
    };
    fetchData();

  }, [])

  return (
    <div className="bg-background-100 min-h-screen min-w-max">
      <BrowserRouter>
        <Header isLogged={false} username={"Somix"} />
        <div className='lg:mx-56 md:mx-24 mx-4'>
          <Routes>
            <Route exact path='/' element={<HomePage courses={courses} loading={loading} />}></Route>
            <Route exact path='/login' element={<LoginPage />}></Route>
            <Route path='*' element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
