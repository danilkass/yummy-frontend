import Main from "./pages/Main/Main";
import PostPage from "./pages/PostPage/PostPage";
import Redactor from "./pages/Redactor/Redactor";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration";
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
    path: POST_ROUTE + "/:id",
    Component: PostPage,
  },
  {
    path: REDACTOR_ROUTE,
    Component: Redactor,
  },
  {
    path: POST_ROUTE + "/:id" + REDACTOR_ROUTE,
    Component: Redactor,
  },
  {
    path: LOGIN_ROUTE,
    Component: Login,
  },
  {
    path: REGISTRATION_ROUTE,
    Component: Registration,
  },

  {
    path: PROFILE_ROUTE, //          +"/:id"
    Component: Profile,
  },
];

export default routes;
