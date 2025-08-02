import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          token,
          name: decoded.name || decoded.email || decoded.mobile || 'User',
          ...decoded,
        });
      } catch (e) {
        setUser({ token, name: 'User' });
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (jwtToken) => {
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken);
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  const isAuthenticated = !!token;

  return (
    <UserContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
} 