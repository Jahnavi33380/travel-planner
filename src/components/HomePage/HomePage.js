import NavBar from '../../components/NavBarComponent/Navbar'
import Header from '../../components/HeaderComponent/Header'
import React, { useState } from 'react';
import EditPreferences from './../EditPreferences';

const HomePage = ({ userDetails }) => {
  const [showEditPreferences, setShowEditPreferences] = useState(false);

  const toggleEditPreferences = () => {
    setShowEditPreferences(!showEditPreferences);
  };

  return (
    <div className="home-content">
      <NavBar userDetails={userDetails} onEditPreferences={toggleEditPreferences} />
      {showEditPreferences ? (
        <EditPreferences onClose={toggleEditPreferences} userDetails={userDetails} />
      ) : (
        <h1>Welcome to the Home Page</h1>
      )}
    </div>
  );
};

export default HomePage;