import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { getDatabase, ref, set, get, child, query, orderByChild, equalTo } from "firebase/database";
import './LoginSignupPage.css';
import HomePage from '../../components/HomePage/HomePage'

const LoginSignupPage = () => {
  const [signUp, setSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    age: "",
    confirmPassword: "",
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [popupStage, setPopupStage] = useState(null);
  const [gender, setGender] = useState("");
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [foodPreferences, setFoodPreferences] = useState([]);
  const [selectedFood, setSelectedFood] = useState([]);
  const [errors, setErrors] = useState({});
  const [forgotPassword, setForgotPassword] = useState(false);


  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const db = getDatabase();
      const userId = user.uid;

      await set(ref(db, "users/" + userId), {
        name: user.displayName,
        email: user.email,
        phone: user.phoneNumber || "",
      });

      setUserDetails({
        id: userId,
        name: user.displayName,
        email: user.email,
      });

      setPopupStage("gender");
    } catch (error) {
      console.error("Error during Google Sign-Up:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const db = getDatabase();
      const userId = user.uid;

      const userRef = ref(db, `users/${userId}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        setUserDetails({
          id: userId,
          ...snapshot.val()
        });
        setLoggedIn(true);
      } else {
        await set(userRef, {
          name: user.displayName,
          email: user.email,
          phone: user.phoneNumber || "",
        });

        setUserDetails({
          id: userId,
          name: user.displayName,
          email: user.email,
        });

        setPopupStage("gender");
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setForgotPassword(true);
  };
  const sendResetEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, formData.email);
      alert("Password reset email sent. Check your inbox.");
      setForgotPassword(false);
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isPasswordValid = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  };

  useEffect(() => {
    if (popupStage === "interests") {
      fetchInterests();
    } else if (popupStage === "food") {
      fetchFoodPreferences();
    }
  }, [popupStage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleSignUp = () => {
    setSignUp((prev) => !prev);
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      age: "",
      confirmPassword: "",
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!isPasswordValid(formData.password)) {
        setErrors(prev => ({...prev, password: "Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters."}));
        return;
      }

    setLoading(true);
    try {
    const db = getDatabase();
        const phoneSnapshot = await get(query(ref(db, "users"), orderByChild("phone"), equalTo(formData.phone)));
        if (phoneSnapshot.exists()) {
           setErrors(prev => ({...prev, phone: "This phone number is already in use."}));
                setLoading(false);
                return;
        }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );


      const userId = userCredential.user.uid;

      await set(ref(db, "users/" + userId), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
      });

      setUserDetails({
        id: userId,
        name: formData.name,
        email: formData.email,
      });
      setPopupStage("gender");
    } catch (error) {
          if (error.code === "auth/email-already-in-use") {
            setErrors(prev => ({...prev, email: "This email is already in use."}));
          } else {
            setErrors(prev => ({...prev, general: error.message}));
          }
        } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const userId = userCredential.user.uid;
      const dbRef = ref(getDatabase());
      const snapshot = await get(child(dbRef, `users/${userId}`));

      if (snapshot.exists()) {
        setUserDetails({ id: userId, ...snapshot.val() });
        setLoggedIn(true);
      } else {
        alert("No user data found.");
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenderSelection = async (selectedGender) => {
    setGender(selectedGender);
    const db = getDatabase();
    await set(ref(db, `users/${userDetails.id}/gender`), selectedGender);
    setPopupStage("interests");
  };

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

 const fetchInterests = async () => {
   const dbRef = ref(getDatabase());
   try {
     const snapshot = await get(child(dbRef, "interests"));
     if (snapshot.exists()) {
       setInterests(snapshot.val());
     } else {
       console.error("No interests data found in Firebase.");
     }
   } catch (error) {
     console.error("Error fetching interests:", error);
   }
 };


 const handleInterestSelection = async () => {
   const db = getDatabase();
   try {
     await set(ref(db, `users/${userDetails.id}/interests`), selectedInterests);
     setPopupStage("food");
   } catch (error) {
     console.error("Error saving selected interests : ", error);
   }
 };


 const fetchFoodPreferences = async () => {
   const dbRef = ref(getDatabase());
   try {
     const snapshot = await get(child(dbRef, "food"));
     if (snapshot.exists()) {
       setFoodPreferences(snapshot.val());
     } else {
       console.error("No food preferences data found in Firebase");
     }
   } catch (error) {
     console.error("Error fetching food preferences : ", error);
   }
 };

 const handleFoodSelection = async () => {
   const db = getDatabase();
   try {
     await set(
       ref(db, `users/${userDetails.id}/foodPreferences`),
       selectedFood
     );
     setLoggedIn(true);
   } catch (error) {
     console.error("Error saving food preferences : ", error);
   }
 };

return (
  <>
    {loggedIn ? (
      <HomePage userDetails={userDetails} />
    ) : (
      <div id="login-signup">
        {loading && <p>Loading...</p>}
        {forgotPassword ? (
          <div className="forgot-password">
            <h1>Reset Password</h1>
            <form onSubmit={sendResetEmail}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleInputChange}
                value={formData.email}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Email"}
              </button>
            </form>
            <p>
              <a href="#" onClick={() => setForgotPassword(false)}>Back to Login</a>
            </p>
          </div>
        ) : popupStage ? (
          popupStage === "gender" ? (
            <div className="popup">
              <h2>Select Your Gender</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {["Male", "Female", "Non-binary", "Prefer not to say"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setGender(option)}
                    style={{
                      backgroundColor: gender === option ? '#007bff' : '#f0f0f0',
                      color: gender === option ? 'white' : 'black'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleGenderSelection(gender)}
                disabled={!gender}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: gender ? '#007bff' : '#cccccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: gender ? 'pointer' : 'not-allowed'
                }}
              >
                Next
              </button>
            </div>
          ) : popupStage === "interests" ? (
            <div className="popup">
              <h2>Select Your Interests</h2>
              {Object.entries(interests).map(([category, items]) => (
                <div key={category}>
                  <h3>{category}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {items.map((interest, index) => (
                      <Chip
                        key={index}
                        label={interest}
                        selected={selectedInterests.includes(interest)}
                        onClick={() => {
                          if (selectedInterests.includes(interest)) {
                            setSelectedInterests(selectedInterests.filter(item => item !== interest));
                          } else {
                            setSelectedInterests([...selectedInterests, interest]);
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={handleInterestSelection}>Next</button>
            </div>
          ) : popupStage === "food" ? (
            <div className="popup">
              <h2>Select Your Food Preferences</h2>
              {Object.entries(foodPreferences).map(([category, items]) => (
                <div key={category}>
                  <h3>{category}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {items.map((food, index) => (
                      <Chip
                        key={index}
                        label={food}
                        selected={selectedFood.includes(food)}
                        onClick={() => {
                          if (selectedFood.includes(food)) {
                            setSelectedFood(selectedFood.filter(item => item !== food));
                          } else {
                            setSelectedFood([...selectedFood, food]);
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={handleFoodSelection}>Finish</button>
            </div>
          ) : null
        ) : signUp ? (
          <div className="sign-up-form-of-user">
            <h1>Sign Up</h1>
            <form onSubmit={handleSignUp}>
              <input type="text" name="name" placeholder="Name" onChange={handleInputChange} value={formData.name} required />
              <input type="email" name="email" placeholder="Email" onChange={handleInputChange} value={formData.email} required />
               {errors.email && <p className="error-message">{errors.email}</p>}
              <input type="tel" name="phone" placeholder="Phone" onChange={handleInputChange} value={formData.phone} />
              {errors.phone && <p className="error-message">{errors.phone}</p>}
              <input type="number" name="age" placeholder="Age" onChange={handleInputChange} value={formData.age} />
              <input type="password" name="password" placeholder="Password" onChange={handleInputChange} value={formData.password} required />
              {errors.password && <p className="error-message">{errors.password}</p>}
              <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleInputChange} value={formData.confirmPassword} required />
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
              {errors.general && <p className="error-message">{errors.general}</p>}
              <button type="submit" disabled={loading}>
                {loading ? "Signing Up......" : "Sign Up"}
              </button>
            </form>
            <br/>
            <button onClick={handleGoogleSignUp} class="google-btn">Sign Up with Google</button>
            <p>
              Already have an account?{" "}
              <a href="#" onClick={toggleSignUp}>Log In Here</a>
            </p>
          </div>
        ) : (
          <div className="login">
            <h1>Log In</h1>
            <form onSubmit={handleLogin}>
              <input type="email" name="email" placeholder="Email" onChange={handleInputChange} value={formData.email} required />
              <input type="password" name="password" placeholder="Password" onChange={handleInputChange} value={formData.password} required />
              <p>
                <a href="#" onClick={handleForgotPassword}>Forgot Password?</a>
              </p>
              <button type="submit" disabled={loading}>
                {loading ? "Logging In..." : "Log In"}
              </button>
            </form>
            <br/>
            <button onClick={handleGoogleSignIn} disabled={loading} class="google-btn">
                {loading ? "Signing In..." : "Sign In with Google"}
              </button>
            <p>
              Don't have an account?{" "}
              <a href="#" onClick={toggleSignUp}>Sign Up Here</a>
            </p>
          </div>
        )}
      </div>
    )}
  </>
); }

export default LoginSignupPage;

