import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { isAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!isAuth) {
        navigate("/");
      }
    },
    [isAuth, navigate]
  );
  return (isAuth) ?children : null;
}

export default ProtectedRoute;
