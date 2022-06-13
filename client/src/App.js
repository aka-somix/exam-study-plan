import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';

const { useState, useEffect } = require('react');



const studyPlanService = require('./service/studyPlanService').default;
const userService = require('./service/userService').default;

function App() {

  // Courses State representation
  const [courses, setCourses] = useState([]);

  // Fetch Data Error
  const [fetchError, setFetchError] = useState(false);

  // Credentials State
  const [user, setUser] = useState({});
  const [isLogged, setIsLogged] = useState(false);

  // Initial Loading
  const [loading, setLoading] = useState(true);


  /*
   *  -- API CONNECTION -- 
   */

  const login = async (credentials) => {
    await userService.logIn(credentials)
      .then(user => {
        setIsLogged(true);
        setUser(user);
      })
      .catch(err => {
        // TODO SHOW ERROR TOAST
        console.error(err)
      }
      );
  };

  const logout = async () => {
    await userService.logOut();
    setIsLogged(false);
    setUser({});
  };

  // Credentials found hook
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        const user = await userService.getUserInfo();
        setUser(user);
        setIsLogged(true);
      } catch (err) {
        // TODO SHOW ERROR TOAST
        console.warn(err)
      }
    };
    checkAuth();
  }, []);

  // Get all Courses
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
  }, []);



  return (
    <div className="bg-background-100 min-h-screen min-w-max">
      <BrowserRouter>
        <Header isLogged={isLogged} user={user} logout={logout} />
        <div className='lg:mx-56 md:mx-24 mx-4'>
          <Routes>
            <Route exact path='/'
              element={<HomePage courses={courses} loading={loading} />}
            />
            <Route exact path='/login'
              element={<LoginPage isLogged={isLogged} login={login} />}
            />
            <Route path='*' element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
