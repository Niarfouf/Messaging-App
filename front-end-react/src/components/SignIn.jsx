import { useState } from "react";
const SignIn = ({ setUserStatus }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3000/register/sign-in`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("A server error has occurred, impossible to connect");
        }
        return response.json();
      })
      .then((response) => {
        if (response.errors) {
          setErrorMessage("Invalid email/password");
        }

        if (response.message) {
          setUserStatus(true);
        }
      })
      .catch((error) => {
        alert(error);
      });
  };
  return (
    <>
      <div className="sign-in">
        <h2>Already have an account?</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email adress:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          {errorMessage ?? <p>{errorMessage}</p>}
          <button type="submit">Sign-in</button>
        </form>
      </div>
    </>
  );
};
export default SignIn;
