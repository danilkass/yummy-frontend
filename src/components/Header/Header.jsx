import React, { useEffect, useState } from "react";
import logoImg from "../../assets/logo.png";
import styles from "./Header.module.scss";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";
import {
  LOGIN_ROUTE,
  MAIN_ROUTE,
  PROFILE_ROUTE,
  SERVER_URL,
  STATICFILES_ROUTE,
  USERFILES_ROUTE,
} from "../../utils/const";
import { Avatar, InputAdornment, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import { setSearchQuery } from "../../redux/slices/searchQuery";

export const Header = () => {
  const isAuth = useSelector(selectIsAuth);
  const user = useSelector((state) => state.auth.data);
  console.log("HEDER RENDER!!! USER: ", user);
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (e) => {
    setSearchValue(e.target.value);
    dispatch(setSearchQuery(e.target.value));
  };

  const [avatarLoaded, setAvatarLoaded] = useState(true);

  const handleImageError = () => {
    setAvatarLoaded(false); // Устанавливаем состояние в false, если возникает ошибка при загрузке изображения
  };

  useEffect(() => {
    setAvatarLoaded(true);
  }, [user]);

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link to={MAIN_ROUTE} className={styles.logo}>
            <div className={styles.logoImage}>
              <img src={logoImg} alt="logo" />
            </div>
            <h2>YUMMY</h2>
          </Link>

          <TextField
            type="text"
            className={styles.searchInput}
            autoComplete="off"
            value={searchValue}
            onChange={(e) => handleChange(e)}
            placeholder="Пошук..."
            variant={"filled"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <div className={styles.inner} style={{ gap: "20px" }}>
            {isAuth ? (
              <Link to={PROFILE_ROUTE} className={styles.inner}>
                {/* {user && ( */}
                <Typography pr={"10px"} fontSize={"18px"} color={"var(--secondary-color)"}>
                  {user.user?.name}
                </Typography>
                {/* )} */}
                <Avatar
                  alt="avatar"
                  src={
                    avatarLoaded
                      ? `${SERVER_URL}${USERFILES_ROUTE}/${user.user?.avatar}`
                      : `${SERVER_URL}${STATICFILES_ROUTE}/noavatar.png`
                  }
                  style={{ cursor: "pointer" }}
                  onError={handleImageError}
                />
              </Link>
            ) : (
              <Link to={LOGIN_ROUTE}>
                <Avatar
                  alt="avatar"
                  src={`${SERVER_URL}${STATICFILES_ROUTE}/noavatar.png`}
                  style={{ cursor: "pointer" }}
                />
              </Link>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
