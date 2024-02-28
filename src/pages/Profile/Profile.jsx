import { Avatar, Button } from "@mui/material";
import styles from "./Profile.module.scss";
import { Link, Navigate } from "react-router-dom";
import {
  LOGIN_ROUTE,
  POST_ROUTE,
  REDACTOR_ROUTE,
  SERVER_URL,
  STATICFILES_ROUTE,
  USERFILES_ROUTE,
} from "../../utils/const";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsAuth } from "../../redux/slices/auth";

function Profile() {
  const isAuth = useSelector(selectIsAuth);
  const user = useSelector((state) => state.auth.data);
  const dispatch = useDispatch();

  const onClickLogout = () => {
    if (window.confirm("Ви дійсно бажаєте вийти із акаунту?")) {
      dispatch(logout());
      window.localStorage.removeItem("token");
    }
  };

  if (!isAuth) {
    return <Navigate to={LOGIN_ROUTE} />;
  }

  return (
    <>
      <Avatar
        alt="avatar"
        src={
          user.user?.avatar
            ? `${SERVER_URL}${USERFILES_ROUTE}/${user.user.avatar}`
            : `${SERVER_URL}${STATICFILES_ROUTE}/noavatar.png`
        }
        sx={{ width: 100, height: 100 }}
        style={{ marginBottom: "20px" }}
      />
      <div className={styles.profile}>{user.user.name}</div>
      <div className={styles.profile}>{user.user.email}</div>
      <div className={styles.inner}>
        <Link to={REDACTOR_ROUTE}>
          <Button variant="contained">Написати статтю</Button>
        </Link>
        <div>
          <Button onClick={onClickLogout} variant="contained" color="error">
            Выйти
          </Button>
        </div>
      </div>
    </>
  );
}

export default Profile;
