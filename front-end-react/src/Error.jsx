import { Link } from "react-router-dom";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  return (
    <div className="error-page">
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error ? error.statusText || error.message : "Not found"}</i>
      </p>

      <Link className="error-link" to="/home">
        Home
      </Link>
    </div>
  );
};

export default ErrorPage;
