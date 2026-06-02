import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Accueil() {
  const [pseudo, setPseudo] = useState("");
  const [erreur, setErreur] = useState("");
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!pseudo.trim()) {
      setErreur("Veuillez entrer un pseudo");
      return;
    }
    
    if (pseudo.includes(" ")) {
      setErreur("Le pseudo ne doit pas contenir d'espaces");
      return;
    }
    
    const result = await login(pseudo);
    
    if (result.success) {
      navigate("/quiz");
    } else {
      setErreur(result.error || "Erreur de connexion");
    }
  };

  return (
    <div className="accueil">
      <h1>PolyQuiz</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Entrez votre pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
        />
        {erreur && <p style={{ color: "red" }}>{erreur}</p>}
        <button type="submit">Commencer</button>
      </form>
    </div>
  );
}

export default Accueil;