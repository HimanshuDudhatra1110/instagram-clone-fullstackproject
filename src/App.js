import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import * as ROUTES from "./constants/routes";
import userAuthListener from "./hooks/use-auth-listener";
import UserContext from "./context/user";

const Login = lazy(() => import("./pages/login"));
const Signup = lazy(() => import("./pages/sign-up"));
const NotFound = lazy(() => import("./pages/not-found"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Profile = lazy(() => import("./pages/profile"));
const CreatePost = lazy(() => import("./pages/create-post"));
const Avtar = lazy(() => import("./pages/avtar"));

function App() {
  const { user } = userAuthListener();

  return (
    <UserContext.Provider value={{ user }}>
      <BrowserRouter>
        <Suspense fallback={<p>loading.....</p>}>
          <Routes>
            <Route path={ROUTES.LOGIN} Component={Login} />
            <Route path={ROUTES.SIGN_UP} Component={Signup} />
            <Route path={ROUTES.PROFILE} Component={Profile} />
            <Route path={ROUTES.DASHBOARD} Component={Dashboard} />
            <Route path={ROUTES.CREATE_POST} Component={CreatePost} />
            <Route path={ROUTES.AVTAR} Component={Avtar} />
            <Route path="*" Component={NotFound} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
