import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Accueil() {
  const [inputPseudo, setInputPseudo] = useState("");
  const { setPseudo } = useContext(UserContext);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!inputPseudo.trim()) return;
    setPseudo(inputPseudo.trim());
    navigate("/quiz");
  }

  return (
    <div>
      <h1>Bienvenue sur PolyQuiz</h1>
      <p>Saisis ton pseudo pour commencer</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ton pseudo"
          value={inputPseudo}
          onChange={(e) => setInputPseudo(e.target.value)}
        />
        <button type="submit">Jouer</button>
      </form>
    </div>
  );
}

export default Accueil;