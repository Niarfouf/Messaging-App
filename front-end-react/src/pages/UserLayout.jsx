import useFetchData from "../hooks/useFetchData";
import { Link } from "react-router-dom";
const UserLayout = () => {
  const { data, error, loading } = useFetchData("user/info");
  if (error)
    return (
      <div className="error-page">
        <p>Impossible to fetch your profile. Please try again.</p>
        <Link className="error-link" to="/home">
          Reload
        </Link>
      </div>
    );

  if (loading) return <p className="loading">Loading user profile...</p>;
  return (
    <>
      <main>
        <h1>Welcome {data.pseudo}</h1>
        <button>Profile</button>
        <button>Disconnect</button>
      </main>
      <Conversations></Conversations>
      <Friends></Friends>
      <Outlet></Outlet>
    </>
  );
};
export default UserLayout;
