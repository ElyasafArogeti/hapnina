import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No token found');
        }

        // בדיקת תוקף הטוקן מול השרת
        const response = await axios.post(
          'http://localhost:3000/api/verifyToken',
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { role } = await response.data.user;
        

        // בדיקה אם המשתמש הוא מנהל
        if (role === 'manager') {
          setIsAuthorized(true);
        } else {
          throw new Error('User is not authorized');
        }
      } catch (error) {
        // במקרה של כשל, ננקה את הטוקן וננווט לדף הבית
        localStorage.removeItem('authToken');
        navigate('/', { state: { from: location.pathname } });
      }
    };

    verifyToken();
  }, [navigate, location]);

  // הצגת טוען עד לסיום האימות
  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  // אם המשתמש מאושר, מציגים את התוכן של הדף
  return isAuthorized ? children : null;
};

export default ProtectedRoute;
