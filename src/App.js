import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginSignupPage from './components/LoginSignupPage/LoginSignupPage';
import HomePage from './components/HomePage/HomePage';
import Navbar from './components/NavBarComponent/Navbar';
import EditPreferences from './components/EditPreferences';
import TravelPlannerPage from './components/TravelPlannerComponent/TravelPlannerPage';

const App = () => {
  const [userDetails, setUserDetails] = useState(null); 

  return (
    <Router>
      <div className="app">
        {userDetails && <Navbar />} {/* Show Navbar if user is logged in */}
        <Routes>
          {/* Login Route */}
          <Route
            path="/login"
            element={
              userDetails ? (
                <Navigate to="/home" replace /> // Redirect to home if already logged in
              ) : (
                <LoginSignupPage setUserDetails={setUserDetails} />
              )
            }
          />

          {/* Home Route */}
          <Route
            path="/home"
            element={
              userDetails ? (
                <HomePage userDetails={userDetails} />
              ) : (
                <Navigate to="/login" replace /> // Redirect to login if not logged in
              )
            }
          />

          {/* Travel Planner Page */}
          <Route
            path="/travelPlanner"
            element={
              userDetails ? (
                <TravelPlannerPage /> // Show TravelPlannerPage if user is logged in
              ) : (
                <Navigate to="/login" replace /> // Redirect to login if not logged in
              )
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Edit Preferences Route */}
          <Route path="/preferences" element={<EditPreferences />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
