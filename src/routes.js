import Main from "./pages/Main/Main";
import PostPage from "./pages/PostPage/PostPage";
import Redactor from "./pages/Redactor/Redactor";
import Auth from "./pages/Auth/Auth";
import Profile from "./pages/Profile/Profile";

import {
  LOGIN_ROUTE,
  MAIN_ROUTE,
  POST_ROUTE,
  PROFILE_ROUTE,
  REDACTOR_ROUTE,
  REGISTRATION_ROUTE,
} from "./utils/const";

const routes = [
  {
    path: MAIN_ROUTE,
    Component: Main,
  },
  {
    path: POST_ROUTE,
    Component: PostPage,
  },
  {
    path: REDACTOR_ROUTE,
    Component: Redactor,
  },
  {
    path: LOGIN_ROUTE,
    Component: Auth,
  },
  {
    path: REGISTRATION_ROUTE,
    Component: Auth,
  },
  {
    path: PROFILE_ROUTE,
    Component: Profile,
  },
];

export default routes;
