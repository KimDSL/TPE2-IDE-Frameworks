import { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [pseudo, setPseudo] = useState(null);
  const [meilleurScore, setMeilleurScore] = useState(0);
  const [token, setToken] = useState(null);

  // Charger la session au demarrage
  useEffect(() => {
    const savedToken = localStorage.getItem('polyquiz_token');
    const savedUser = localStorage.getItem('polyquiz_user');
    
    if (savedToken && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setToken(savedToken);
        setPseudo(user.pseudo);
        setMeilleurScore(user.bestScore);
      } catch(e) {
        console.error(e);
      }
    }
  }, []);

  // Fonction de connexion avec l'API
  const login = async (pseudo) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pseudo })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion');
      }
      
      localStorage.setItem('polyquiz_token', data.token);
      localStorage.setItem('polyquiz_user', JSON.stringify(data.user));
      
      setToken(data.token);
      setPseudo(data.user.pseudo);
      setMeilleurScore(data.user.bestScore);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Deconnexion
  const logout = () => {
    localStorage.removeItem('polyquiz_token');
    localStorage.removeItem('polyquiz_user');
    setToken(null);
    setPseudo(null);
    setMeilleurScore(0);
  };

  // Mise a jour du score
  const updateScore = async (newScore) => {
    if (!token) return false;
    
    try {
      const response = await fetch('http://localhost:5000/api/users/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Bearer ${token}
        },
        body: JSON.stringify({ newScore })
      });
      
      const data = await response.json();
      
      if (response.ok && data.recordBattu) {
        setMeilleurScore(newScore);
        // Mettre a jour localStorage
        const savedUser = localStorage.getItem('polyquiz_user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          user.bestScore = newScore;
          localStorage.setItem('polyquiz_user', JSON.stringify(user));
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur:', error);
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ 
      pseudo, setPseudo, 
      meilleurScore, setMeilleurScore,
      token, login, logout, updateScore
    }}>
      {children}
    </UserContext.Provider>
  );
}