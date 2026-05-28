import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Resultats() {
  const { pseudo, meilleurScore } = useContext(UserContext);
  const navigate = useNavigate();

  const ratio = useMemo(() => {
    return ((meilleurScore / 10) * 100).toFixed(1);
  }, [meilleurScore]);

  return (
    <div className="resultats">
      <h1>Résultats</h1>
      <p>Bravo {pseudo} !</p>
      <p>Score : {meilleurScore} / 10</p>
      <p>Ratio de bonnes réponses : {ratio}%</p>
      <button onClick={() => navigate("/")}>
        Rejouer
      </button>
    </div>
  );
}

export default Resultats;