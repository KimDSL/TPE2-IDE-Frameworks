import { useReducer, useEffect, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { UserContext } from "../context/UserContext";

const initialState = {
  index: 0,
  score: 0,
  reponseSelectionnee: null,
  statut: "en_attente",
};

function quizReducer(state, action) {
  switch (action.type) {
    case "START_QUIZ":
      return { ...state, statut: "en_cours" };

    case "ANSWER_QUESTION":
      const estCorrecte = action.reponse === action.bonneReponse;
      return {
        ...state,
        reponseSelectionnee: action.reponse,
        score: estCorrecte ? state.score + 1 : state.score,
        index: state.index + 1,
      };

    case "FINISH_QUIZ":
      return { ...state, statut: "termine" };

    default:
      return state;
  }
}

function Quiz() {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const [tempsRestant, setTempsRestant] = useState(60);
  const { data: questions, loading, error } = useFetch("/questions.json");
  const navigate = useNavigate();
  const { setMeilleurScore } = useContext(UserContext);
  const timerRef = useRef(null);

  // Chronomètre
  useEffect(() => {
    if (state.statut === "en_cours") {
      timerRef.current = setInterval(() => {
        setTempsRestant((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            dispatch({ type: "FINISH_QUIZ" });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [state.statut]);

  // Fin du quiz
  useEffect(() => {
    if (questions && (state.statut === "termine" || state.index >= questions.length)) {
      clearInterval(timerRef.current);
      dispatch({ type: "FINISH_QUIZ" });
      setMeilleurScore(state.score);
      navigate("/resultats");
    }
  }, [state.index, state.statut]);

  if (loading) return <p>Chargement des questions...</p>;
  if (error) return <p>Erreur : {error}</p>;

  const questionCourante = questions[state.index];

  return (
    <div>
      <h1>Quiz</h1>
      <p>Temps restant : {tempsRestant}s</p>
      <p>Score : {state.score}</p>
      <p>Question {state.index + 1} / {questions.length}</p>
      <h2>{questionCourante.libelle}</h2>
      {questionCourante.options.map((option) => (
        <button
          key={option}
          onClick={() => dispatch({
            type: "ANSWER_QUESTION",
            reponse: option,
            bonneReponse: questionCourante.bonne_reponse,
          })}
        >
          {option}
        </button>
      ))}
      <button onClick={() => dispatch({ type: "START_QUIZ" })}>
        Démarrer
      </button>
    </div>
  );
}

export default Quiz;