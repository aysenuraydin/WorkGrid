import { Navigate } from "react-router-dom";
import { useAuth } from "context/AuthContext"; 
import { Container } from "reactstrap";
import Loader from "components/Common/Loader";

const AuthProtected = (props: any) => {
    const { accessToken, isLoading } = useAuth(); 
    
    if (isLoading) {
      return <div className="page-content"><Container fluid><Loader isText /></Container></div>;
    }

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return <>{props.children}</>;
};

export default AuthProtected;