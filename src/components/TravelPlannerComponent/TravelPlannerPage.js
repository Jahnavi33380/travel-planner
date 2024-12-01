import React, { useState } from 'react';
import './TravelPlannerPage.css';

const TravelPlannerPage = () => {
  // State hooks for each field
  const [pickupCity, setPickupCity] = useState('');
  const [numDays, setNumDays] = useState('');
  const [numPeople, setNumPeople] = useState('');
  const [modeOfTransport, setModeOfTransport] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false); // State for current location usage
  const [errorMessage, setErrorMessage] = useState('');
  const [manualLocation, setManualLocation] = useState(''); // State for manual location input

  // List of US states (can be expanded as needed)
  const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
    "Wisconsin", "Wyoming"
  ];

  // Function to handle fetching current location and reverse geocoding
  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchAddress(latitude, longitude); // Get address from coordinates
        },
        (error) => {
          setErrorMessage('Unable to retrieve your location. Please enter it manually.');
        }
      );
    } else {
      setErrorMessage('Geolocation is not supported by your browser.');
    }
  };

  // Function to fetch the human-readable address using reverse geocoding
  const fetchAddress = async (latitude, longitude) => {
    const apiKey = 'YOUR_GOOGLE_API_KEY'; // Replace with your Google Maps API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'OK') {
        setPickupCity(data.results[0].formatted_address); // Set the formatted address in the pickupCity field
      } else {
        setErrorMessage('Unable to retrieve address.');
      }
    } catch (error) {
      setErrorMessage('Error fetching address.');
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      pickupCity,
      numDays,
      numPeople,
      modeOfTransport
    });
  };

  return (
    <div className="travel-planner">
      <h2>Travel Planner</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="pickupCity">Pickup City</label>
          <div>
            {/* User can choose to use current location or enter manually */}
            <button
              type="button"
              onClick={() => setUseCurrentLocation(true)}
              className="location-btn"
            >
              Use Current Location
            </button>
            {useCurrentLocation ? (
              <>
                <button
                  type="button"
                  onClick={fetchCurrentLocation}
                  className="location-btn"
                >
                  Get Current Location
                </button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {/* If there's an error, allow the user to enter location manually */}
                {errorMessage && (
                  <input
                    type="text"
                    placeholder="Enter your current location"
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                    onBlur={() => setPickupCity(manualLocation)} // Automatically set pickup city when focus is lost
                    className="manual-location-input"
                  />
                )}
              </>
            ) : (
              <select 
                id="pickupCity" 
                value={pickupCity} 
                onChange={(e) => setPickupCity(e.target.value)} 
                required
              >
                <option value="">Select a State</option>
                {usStates.map((state, index) => (
                  <option key={index} value={state}>{state}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="numDays">Number of Days</label>
          <select 
            id="numDays" 
            value={numDays} 
            onChange={(e) => setNumDays(e.target.value)} 
            required
          >
            <option value="">Select Days</option>
            {[1, 2, 3, 4, 5].map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="numPeople">Number of People</label>
          <select 
            id="numPeople" 
            value={numPeople} 
            onChange={(e) => setNumPeople(e.target.value)} 
            required
          >
            <option value="">Select Number of People</option>
            {[1, 2, 3, 4].map((people) => (
              <option key={people} value={people}>{people}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="modeOfTransport">Mode of Transport</label>
          <select 
            id="modeOfTransport" 
            value={modeOfTransport} 
            onChange={(e) => setModeOfTransport(e.target.value)} 
            required
          >
            <option value="">Select Transport</option>
            <option value="car">Car</option>
            <option value="metro">Metro</option>
            <option value="rentalCar">Rental Car</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default TravelPlannerPage;
