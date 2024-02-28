import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import styles from "./Login.module.scss";
import { Link, Navigate } from "react-router-dom";
import { MAIN_ROUTE, REGISTRATION_ROUTE } from "../../utils/const";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogin, selectIsAuth } from "../../redux/slices/auth";

function Login() {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch({});

  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchLogin(values));
    setFormError("");

    if (!data.payload) {
      // return alert("Не вдалось увійти до акаунту");
      return setFormError("Користувач не зареєстрований");
    }

    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
    }
    console.log(data);
  };

  if (isAuth) {
    return <Navigate to={MAIN_ROUTE} />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography classes={{ root: styles.title }} variant="h5">
          Вхід в акаунт
        </Typography>

        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register("email", { required: "Вкажіть пошту" })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Пароль"
          error={Boolean(errors.password?.message)}
          fullWidth
          helperText={errors.password?.message}
          {...register("password", { required: "Вкажіть пароль" })}
        />

        {formError && (
          <Typography variant="body2" color="error" mb={"6px"} className={styles.error}>
            {formError}
          </Typography>
        )}

        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Увійти
        </Button>

        <Link className={styles.link} to={REGISTRATION_ROUTE}>
          Зареєструватися
        </Link>
      </form>
    </Paper>
  );
}

export default Login;
