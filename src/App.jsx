import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './views/pages/HomePage.jsx';
import Login from './views/pages/Login.jsx';
import Signup from './views/pages/Signup.jsx';
import Calendar from './views/pages/Calendar.jsx';
import CreateEvent from './views/components/CreateEvent.jsx';
import EventDetails from './views/components/EventDetails.jsx';
import axios from 'axios';
import ProfilePage from './views/pages/ProfilePage.jsx'; 
import AccountPage from './views/pages/AccountPage.jsx'; 
import {userIsLoggedIn} from './controllers/userController.js'

const LoginPage = () => {
  const loggedIn = userIsLoggedIn(); //This has to be in every component that needs it, (cant be global) in order to respond instantly to changes in session/local storage
  if (loggedIn) return <Navigate to='/' replace={true}/>

  return <Login />;
};

const SignupPage = () => {
  const loggedIn = userIsLoggedIn();
  if (loggedIn) return <Navigate to='/' replace={true}/>

  return <Signup />;
};

const HomePage = () => {
  const loggedIn = userIsLoggedIn();
  if (!loggedIn) return <Navigate to='/login' replace={true}/>

  return <Home />;
};

const CalendarPage = () => {
  const loggedIn = userIsLoggedIn();
  if (!loggedIn) return <Navigate to='/login' replace={true}/>

  return <Calendar />;
};

const Logout = () => {
  const loggedIn = userIsLoggedIn();
  if (!loggedIn) return <Navigate to='/login' replace={true}/>

  //sessionStorage.removeItem('session');
  // localStorage.removeItem('session');

    sessionStorage.clear();
    localStorage.clear();

  return <Navigate to='/login' replace={true}/>
};



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/CreateEvent" element={<CreateEvent />} />
        <Route path="/EventDetails" element={<EventDetails/>} />
        <Route path="/Profile" element={<ProfilePage/>} /> 
        <Route path="/Account" element={<AccountPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
