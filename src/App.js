import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginSignupPage from './components/LoginSignupPage/LoginSignupPage';
import HomePage from './components/HomePage/HomePage';
import Navbar from './components/NavBarComponent/Navbar';
import EditPreferences from './components/EditPreferences'
const App = () => {
  const [userDetails, setUserDetails] = useState(null);

  return (
    <Router>
      <div className="app">
        {userDetails && <Navbar />}
        <Routes>
          <Route
            path="/login"
            element={
              userDetails ? (
                <Navigate to="/home" replace />
              ) : (
                <LoginSignupPage setUserDetails={setUserDetails} />
              )
            }
          />
          <Route
            path="/home"
            element={
              userDetails ? (
                <HomePage userDetails={userDetails} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/preferences" component={EditPreferences} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;