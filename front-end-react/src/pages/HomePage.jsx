import { Navigate, useOutletContext } from "react-router-dom";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
const HomePage = () => {
  const [userStatus, setUserStatus] = useOutletContext();

  if (userStatus) return <Navigate to="/profile" replace />;

  return (
    <>
      <main>
        <h1>Welcome to Niarfouf messenger !</h1>
        <SignIn setUserStatus={setUserStatus} />
        <SignUp setUserStatus={setUserStatus} />
      </main>
    </>
  );
};
export default HomePage;
