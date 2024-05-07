import App from "./App";
import HomePage from "./pages/HomePage";
import Error from "./Error";
import NotFoundPage from "./pages/NotFoundPage";
import { Navigate } from "react-router-dom";
const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        errorElement: <Error />,
        children: [
          { index: true, element: <Navigate to="/home" replace /> },
          {
            path: "home",
            element: <HomePage />,
          },
          {
            element: <AuthRoute />,
            children: [
              {
                path: "user",
                element: <UserLayout />,
                children: [
                  { path: "profile", element: <Profile /> },
                  {
                    path: "conversations/conversationId",
                    element: <ConversationDetails />,
                  },
                  {
                    path: "friends/friendId",
                    element: <FriendDetails />,
                  },
                  { path: "*", element: <NotFoundPage /> },
                ],
              },
            ],
          },

          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
];

export default routes;
