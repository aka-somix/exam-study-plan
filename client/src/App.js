import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';

import { useState, useEffect, React } from 'react';



const courseService = require('./service/courseService').default;
const studyPlanService = require('./service/studyPlanService').default;
const userService = require('./service/userService').default;

function App() {

  // Courses State representation
  const [courses, setCourses] = useState([]);

  // Student Type representation
  const [studentType, setStudentType] = useState('');

  // Study Plan Courses representation
  const [studyPlanCourses, setStudyPlanCourses] = useState([]);

  // Dirty flag
  const [dirty, setDirty] = useState(true);

  // Errors
  const [loginError, setLoginError] = useState({});

  // Credentials State
  const [user, setUser] = useState({});
  const [isLogged, setIsLogged] = useState(false);

  // Loadings
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  /*
   *  -- API CONNECTION -- 
   */

  const login = (credentials) => {
    setLoginError({});
    setLoginLoading(true);
    userService.logIn(credentials)
      .then(user => {
        setIsLogged(true);
        setUser(user);
        setLoginLoading(false);
      })
      .catch(err => {
        console.error({ err });
        setLoginError({ message: err });
        setLoginLoading(false);
      }
      );
  };

  const logout = async () => {
    await userService.logOut();
    setIsLogged(false);
    setUser({});
  };


  const createStudyPlan = async (studentType) => {
    try {
      const studyPlanCreated = await studyPlanService.createStudyPlan(studentType);

      setStudentType(studyPlanCreated.studentType);
      setStudyPlanCourses(studyPlanCreated.courses);

    } catch (error) {
      console.error(error);
    }
  }

  const deleteStudyPlan = async () => {
    try {
      await studyPlanService.deleteStudyPlan();

      setStudentType('');
      setStudyPlanCourses([]);
      setDirty(true);
    } catch (error) {
      console.error(error);
    }
  }

  const saveStudyPlan = async (courses) => {
    try {
      await studyPlanService.updateStudyPlan(courses);
      setDirty(true);
    } catch (error) {
      console.error(error);
    }
  }



  /*
   *  -- USE EFFECT HOOKS -- 
   */

  // Logged In hook
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Retrieve the user 
        const user = await userService.getUserInfo();
        setUser(user);
        setIsLogged(true);
      } catch (err) {
        console.warn(err);
      }
    };
    checkAuth();
  }, []);

  // Get all Courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesFromDB = await courseService.getAllCourses();
        setLoading(false);
        setDirty(false);
        setCourses(coursesFromDB);
      }
      catch (error) {
        console.error(`Couldn't Retrieve Data from API due to: ${error} `);
      }
    };
    fetchData();
  }, [dirty]);

  // Get StudyPlan
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const studyPlan = await studyPlanService.getStudyPlan();
        setStudentType(studyPlan.studentType);
        setStudyPlanCourses(studyPlan.courses);
        setLoading(false);
      }
      catch (error) {
        setLoading(false);
        console.error(`Couldn't Retrieve Data from API due to: ${error} `);
      }
    };
    if (isLogged) {
      fetchData();
    }
  }, [user, isLogged, dirty]);


  /*
   *  -- JSX Composition -- 
   */
  return (
    <div className="bg-background-100 min-h-screen min-w-max">
      <BrowserRouter>
        <Header isLogged={isLogged} user={user} logout={logout} />
        <div className='lg:mx-56 md:mx-24 mx-4'>
          <Routes>
            <Route exact path='/'
              element={<HomePage
                isLogged={isLogged}
                studyPlanCourses={studyPlanCourses}
                studentType={studentType}
                courses={courses}
                loading={loading}
                createStudyPlan={createStudyPlan}
                deleteStudyPlan={deleteStudyPlan}
                saveStudyPlan={saveStudyPlan}
              />}
            />
            <Route exact path='/login'
              element={<LoginPage isLogged={isLogged} login={login} loginError={loginError} loading={loginLoading} />}
            />
            <Route path='*' element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
