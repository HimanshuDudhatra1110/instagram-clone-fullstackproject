import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import * as ROUTES from "./constants/routes";
import userAuthListener from "./hooks/use-auth-listener";
import UserContext from "./context/user";
import ProtectedRoute from "./helpers/protected-routes";

const Login = lazy(() => import("./pages/login"));
const Signup = lazy(() => import("./pages/sign-up"));
const NotFound = lazy(() => import("./pages/not-found"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Profile = lazy(() => import("./pages/profile"));
const CreatePost = lazy(() => import("./pages/create-post"));
const AddAvtar = lazy(() => import("./pages/avtar"));
const Following = lazy(() => import("./pages/following"));
const Followers = lazy(() => import("./pages/followers"));

function App() {
  const { user } = userAuthListener();

  const isUserLoggedIn = user !== null;

  return (
    <UserContext.Provider value={{ user }}>
      <BrowserRouter>
        <Suspense fallback={<p>loading.....</p>}>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.SIGN_UP} element={<Signup />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route element={<ProtectedRoute isUserLoggedIn={isUserLoggedIn} />}>
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.CREATE_POST} element={<CreatePost />} />
              <Route path={ROUTES.AVTAR} element={<AddAvtar />} />
              <Route path={ROUTES.FOLLOWING} element={<Following />} />
              <Route path={ROUTES.FOLLOWERS} element={<Followers />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
