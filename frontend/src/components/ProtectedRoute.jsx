import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function ProtectedRoute({ children }) {
  const { pseudo } = useContext(UserContext);

  if (!pseudo) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;