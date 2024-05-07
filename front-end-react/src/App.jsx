import { useState } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";

function App() {
  const [userStatus, setUserStatus] = useState(false);

  return (
    <>
      <Outlet context={[userStatus, setUserStatus]} />
    </>
  );
}

export default App;
