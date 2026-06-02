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

    case "ANSWER_QUESTION": {
      const estCorrecte = action.reponse === action.bonneReponse;
      return {
        ...state,
        reponseSelectionnee: action.reponse,
        score: estCorrecte ? state.score + 1 : state.score,
        index: state.index + 1,
      };
    }
    case "FINISH_QUIZ":
      return { ...state, statut: "termine" };

    default:
      return state;
  }
}

function Quiz() {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const [tempsRestant, setTempsRestant] = useState(60);
  const { data: apiResponse, loading, error } = useFetch("http://localhost:5000/api/questions");
  const navigate = useNavigate();
  const { updateScore } = useContext(UserContext); 
  const timerRef = useRef(null);

  const questions = apiResponse?.questions || [];

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

  useEffect(() => {
    if (questions.length > 0 && (state.statut === "termine" || state.index >= questions.length)) {
      clearInterval(timerRef.current);
      dispatch({ type: "FINISH_QUIZ" });
      updateScore(state.score);
      navigate("/resultats");
    }
  }, [state.index, state.statut, questions.length]);

  if (loading) return <p>Chargement des questions...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (questions.length === 0) return <p>Aucune question trouvee. Lancez npm run seed</p>;

  const questionCourante = questions[state.index];
  if (state.index >= questions.length) {
    return <p>Redirection...</p>;
  }

  return (
    <div className="quiz">
      <h1>Quiz</h1>
      <p>Temps restant : {tempsRestant}s</p>
      <p>Score : {state.score}</p>
      <p>Question {state.index + 1} / {questions.length}</p>
      <h2>{questionCourante.text}</h2>
      {questionCourante.options.map((option) => (
        <button
          key={option}
          onClick={() => dispatch({
            type: "ANSWER_QUESTION",
            reponse: option,
            bonneReponse: questionCourante.correctAnswer,
          })}
        >
          {option}
        </button>
      ))}
      <button onClick={() => dispatch({ type: "START_QUIZ" })}>
        Demarrer
      </button>
    </div>
  );
}

export default Quiz;