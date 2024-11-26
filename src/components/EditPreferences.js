import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, update } from 'firebase/database';
import { auth } from './LoginSignupPage/firebase';
import './EditPreferences.css'

const EditPreferences = ({ onClose, userDetails }) => {
  const [interests, setInterests] = useState([]);
  const [foodPreferences, setFoodPreferences] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedFood, setSelectedFood] = useState([]);
  const Chip = ({ label, selected, onClick }) => (
        <button
          onClick={onClick}
          style={{
            margin: '5px',
            padding: '5px 10px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: selected ? '#007bff' : '#f0f0f0',
            color: selected ? 'white' : 'black',
            cursor: 'pointer'
          }}
        >
          {label}
        </button>
      );

  useEffect(() => {
    const fetchPreferences = async () => {
      const db = getDatabase();
      const userRef = ref(db, `users/${auth.currentUser.uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        setSelectedInterests(snapshot.val().interests || []);
        setSelectedFood(snapshot.val().foodPreferences || []);
      }
    };



    const fetchOptions = async () => {
      const db = getDatabase();
      const interestsRef = ref(db, 'interests');
      const foodRef = ref(db, 'food');
      const interestsSnapshot = await get(interestsRef);
      const foodSnapshot = await get(foodRef);
      if (interestsSnapshot.exists()) setInterests(interestsSnapshot.val());
      if (foodSnapshot.exists()) setFoodPreferences(foodSnapshot.val());
    };

    fetchPreferences();
    fetchOptions();
  }, []);

  const handleSave = async () => {
      const db = getDatabase();
      const userRef = ref(db, `users/${userDetails.id}`);
      await update(userRef, {
        interests: selectedInterests,
        foodPreferences: selectedFood
      });
      onClose();
    };

    return (
      <div className="edit-preferences-page">
        <h2>Edit Preferences</h2>
           <div>
                <h3>Interests</h3>
                {Object.entries(interests).map(([category, items]) => (
                  <div key={category}>
                    <h4>{category}</h4>
                    {items.map((interest, index) => (
                      <Chip
                        key={index}
                        label={interest}
                        selected={selectedInterests.includes(interest)}
                        onClick={() => {
                          if (selectedInterests.includes(interest)) {
                            setSelectedInterests(selectedInterests.filter(i => i !== interest));
                          } else {
                            setSelectedInterests([...selectedInterests, interest]);
                          }
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div>
         <h3>Food Preferences</h3>
           {Object.entries(foodPreferences).map(([category, items]) => (
             <div key={category}>
               <h4>{category}</h4>
               {items.map((food, index) => (
                 <Chip
                   key={index}
                   label={food}
                   selected={selectedFood.includes(food)}
                   onClick={() => {
                     if (selectedFood.includes(food)) {
                       setSelectedFood(selectedFood.filter(f => f !== food));
                     } else {
                       setSelectedFood([...selectedFood, food]);
                     }
                   }}
                 />
               ))}
             </div>
           ))}
         </div>
        <br/>
        <button onClick={handleSave}>Save Preferences</button>
        <br/>
        <br/>
        <button onClick={onClose}>Cancel</button>
      </div>
    );
  };

export default EditPreferences;