import { useReducer, useEffect, useContext } from "react";
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
  const { data: questions, loading, error } = useFetch("/questions.json");
  const navigate = useNavigate();
  const { setMeilleurScore } = useContext(UserContext);

  useEffect(() => {
    if (questions && (state.statut === "termine" || state.index >= questions.length)) {
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
    </div>
  );
}

export default Quiz;