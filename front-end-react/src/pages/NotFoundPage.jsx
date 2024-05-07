import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="error-page">
      <p>Sorry, the page you asked for does not exist.</p>
      <p>
        <i>404, Not found</i>
      </p>
      <Link className="error-link" to="/home">
        Back
      </Link>
    </div>
  );
};

export default NotFoundPage;
