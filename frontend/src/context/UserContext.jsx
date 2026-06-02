import { createContext, useState } from "react";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [pseudo, setPseudo] = useState(null);
  const [meilleurScore, setMeilleurScore] = useState(0);

  return (
    <UserContext.Provider value={{ pseudo, setPseudo, meilleurScore, setMeilleurScore }}>
      {children}
    </UserContext.Provider>
  );
}
