import axios from 'axios';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createContext } from 'react';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('/profile')
      .then(({ data }) => {
        setUser(data);
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
