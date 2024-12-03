// UserContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
// import api from '../auth/api'; // Import api
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../util/constants';
import { useNavigate, useLocation } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';
import useMediaQuery from "@mui/material/useMediaQuery";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [loginOrRegisterIsOpen, setLoginOrRegisterIsOpen] = useState(false)
    // const [user, setUser] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(null)
    const [error, setError] = useState(null)
    const [user, setUser] = useState(null)
    const [allUsers, setAllUsers] = useState([])
    const isMobile = useMediaQuery("(max-width:600px)");
    const [currentRoute, setCurrentRoute] = useState("")
    const location = useLocation(); // Gets the current route
    const navigate= useNavigate()

// console.log("login or register is open", loginOrRegisterIsOpen)

    useEffect(() => {
        const checkAuth = async () => {
            // Look for token
            const token = localStorage.getItem(ACCESS_TOKEN);
            
            // If theres no token
            if (!token) {
                // Set isAuthorized to false
                setIsAuthorized(false);
                return;
            }

            // If there is a token, decode it,
            const decoded = jwtDecode(token);

            // Set token expireation
            const tokenExpiration = decoded.exp;
            const now = Date.now() / 1000;

            // If token expired, refresh it
            if (tokenExpiration < now) {
                await refreshToken();
            } else {
            // If token has not expired, just keep signed in    
                setIsAuthorized(true);
            }
        };


        const refreshToken = async () => {
            const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/token/refresh/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refresh: refreshToken }),
                });
        
                if (response.ok) {
                    const data = await response.json();
                    if (data.access) {
                        localStorage.setItem(ACCESS_TOKEN, data.access);
                        setIsAuthorized(true);
                    } else {
                        setIsAuthorized(false);
                    }
                } else {
                    setIsAuthorized(false);
                }
            } catch (error) {
                setIsAuthorized(false);
            }
        };
        

        checkAuth();
    }, []);



      const getUserAndProfile = useCallback(async () => {
        const apiUrl = "http://127.0.0.1:8000";
        const endpoint = "/api/user/profile/";
        const token = localStorage.getItem(ACCESS_TOKEN);

        try {
            const response = await fetch(`${apiUrl}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                // If the response is not OK, assume no profile exists
                setUser(null);
            } else {
                const data = await response.json();
                setUser(data);
            }
        } catch (err) {
            console.log(err);
            setUser(null); // Handle error by setting profile to null
        } finally {
            // setLoading(false); // End loading state regardless of success or failure
        }
    }, []);


    const getAllUsers = useCallback(async () => {
        const apiUrl = "http://127.0.0.1:8000";
        const endpoint = "/api/all-users/";
        const token = localStorage.getItem(ACCESS_TOKEN);

        try {
            const response = await fetch(`${apiUrl}${endpoint}`, {
                method: 'GET',
                headers: {
                    // 'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                // If the response is not OK, assume no profile exists
                setAllUsers(null);
            } else {
                const data = await response.json();
                setAllUsers(data);
            }
        } catch (err) {
            console.log(err);
            setAllUsers(null); // Handle error by setting profile to null
        } finally {
            // setLoading(false); // End loading state regardless of success or failure
        }
    }, []);
      

      useEffect(() => {
        getAllUsers()
        if (isAuthorized) {
            // getMe(); // Call getMe() if the user is authorized
            getUserAndProfile()
    
        }
    }, [isAuthorized]); 

    const login = async (email, password) => {
        const apiUrl = "http://127.0.0.1:8000"; // Base URL of the API
        const endpoint = '/api/token/'; // Endpoint for login
    
        try {
            // Make the POST request to the login endpoint
            const response = await fetch(`${apiUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            // Parse the response JSON once
            const data = await response.json();
    
            // Check if the response is ok (status in the range 200-299)
            if (!response.ok) {
                // Use data object directly for error details
                setLoginOrRegisterIsOpen(true)
                setError(data.error);
                setIsAuthorized(false);
                return; // Exit the function early on error
            }
    
            // Store tokens in localStorage
            localStorage.setItem(ACCESS_TOKEN, data.access);
            localStorage.setItem(REFRESH_TOKEN, data.refresh);

            // await getMe(); // Ensure user data is updated
    
            // Update application state
            setIsAuthorized(true)
            setLoginOrRegisterIsOpen(false)
            navigate('/')
            setError(null);
        } catch (err) {
            // Handle any unexpected errors
            setIsAuthorized(false);
            setError(err.message);
        }
    };
    
    
    // const register = async (email, username, password, password_confirmation) => {
    //     try {
    //         await api.post('/api/user/register/', {email, username, password, password_confirmation});
    //         setError(null);

    //         navigate('/');  // Redirect to login page after successful registration
    //     } catch (err) {
    //         setError('Registration failed, please try again.');
    //         console.error('Registration error:', err);
    //     }
    // };


    const register = async (email, username, password, password_confirmation) => {
        const apiUrl = "http://127.0.0.1:8000/api/user/register/"; // Correct API endpoint for user registration
      
        try {
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Set the content type to JSON
            },
            body: JSON.stringify({
              email: email,
              username: username,
              password: password,
              password_confirmation: password_confirmation,
            }), // Make sure the body is stringified
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Registration failed.");
          }
      
          const data = await response.json();
          console.log("User registered successfully:", data);
          // Handle the success case, like showing a success message or redirecting
      
        } catch (error) {
          console.error("Error during registration:", error);
          // Handle error, such as displaying error message to the user
        }
      };



      useEffect(() => {
        if (location.pathname === "/") {
            setCurrentRoute("Home")
            console.log("setting home")
        } else if (location.pathname === "/admin") {
            setCurrentRoute("Admin")
            console.log("setting other")
        } else {
            setCurrentRoute("")
        }
      }, [location])


    return (
        <UserContext.Provider value={{
            isMobile,
            loginOrRegisterIsOpen,
            setLoginOrRegisterIsOpen,
            login,
            register,
            isAuthorized,
            setIsAuthorized,
            error,
            setError,
            user,
            setUser,
            allUsers,
            setAllUsers,
            currentRoute
              }}>
            {children}
        </UserContext.Provider>
    );
};
