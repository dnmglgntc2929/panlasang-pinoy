// withUserData.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const withUserData = (WrappedComponent) => {
  return (props) => {
    const [userData, setUserData] = useState(null);

    const tokenLoggedOut = async () => {
      try {
          const token = window.localStorage.getItem('jwt');
          console.log('Token being sent:', token);
  
          const response = await axios.post(
              'http://localhost:3001/api/userData',
              { token },
              {
                  headers: {
                      'Content-Type': 'application/json',
                      Accept: 'application/json',
                  },
              }
          );
  
          const data = response.data;
          console.log(data, 'userData');
  
          if (response.status === 401 || (data.status === 'error' && data.data === 'Token expired')) {
              alert('Token has expired');
              // Clear localStorage and force logout
              window.localStorage.clear();
              window.location.replace('/login'); // Use replace to prevent back navigation
          } else {
              setUserData(data.data);
          }
      } catch (error) {
          console.error('Error during API call:', error);
          if (error.response && error.response.status === 401) {
              alert('Token has expired');
              window.localStorage.clear();
              window.location.replace('/login'); // Use replace instead of href
          } else {
              alert('An error occurred. Please try again.');
          }
      }
  };
  
      

    useEffect(() => {
      tokenLoggedOut();
    }, []);

    return <WrappedComponent userData={userData} {...props} />;
  };
};

export default withUserData;
