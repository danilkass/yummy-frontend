import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import styles from "./Login.module.scss";
import { Link, Navigate } from "react-router-dom";
import { LOGIN_ROUTE, MAIN_ROUTE } from "../../utils/const";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogin, fetchRegistration, selectIsAuth } from "../../redux/slices/auth";
import { useForm } from "react-hook-form";
import { Input } from "@mui/material";

function Registration() {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch({});

  const [formError, setFormErrors] = useState("");
  const [avatarMessage, setAvatarMessage] = useState("Завантажити аватар");
  let [avatarImage, setAvatarImage] = useState("");
  useEffect(() => {
    return () => {
      if (avatarImage) {
        URL.revokeObjectURL(avatarImage);
      }
    };
  }, [avatarImage]);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      // avatar: avatarImage,
    },
    mode: "onChange",
  });

  //   const onSubmit = async (values) => {
  //     console.log("DATA ON SUBMIT: ", values);
  //     const data = await dispatch(fetchRegistration(values));

  //     //
  //     setFormErrors("");

  //     if (!data.payload) {
  //       // return alert("Не вдалось увійти до акаунту");
  //       return setFormErrors("Не вдалось створити аккаунт");
  //     }

  //     if ("token" in data.payload) {
  //       window.localStorage.setItem("token", data.payload.token);
  //     }
  //     console.log(data);
  //   };

  const onSubmit = async (values) => {
    // Создаем новый объект FormData
    const formData = new FormData();

    // Добавляем поля формы (name, email, password) в FormData
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);

    // Добавляем файл в FormData, если он был выбран
    if (avatarImage) {
      formData.append("avatar", avatarImage);
    }

    console.log("FormData: ", formData);
    try {
      // Отправляем запрос на регистрацию с помощью fetchRegistration
      const data = await dispatch(fetchRegistration(formData));

      // Сбрасываем ошибки формы
      setFormErrors("");

      // Проверяем результат регистрации
      if (!data.payload) {
        return setFormErrors("Не вдалось створити аккаунт");
      }

      // Если получен токен, сохраняем его в localStorage
      if ("token" in data.payload) {
        window.localStorage.setItem("token", data.payload.token);
      }
      console.log(data);
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      // Обработка ошибок при отправке запроса регистрации
    }
  };

  const validateAvatar = (value) => {
    if (!value[0]) return true;
    const allowedExtensions = ["jpg", "jpeg", "png"];
    const extension = value[0].name.split(".").pop().toLowerCase();

    const validationResult = allowedExtensions.includes(extension);

    if (validationResult) {
      setAvatarMessage(""); // Очищаем сообщение об ошибке
    } else {
      setAvatarMessage("Некоректний формат зображення"); // Устанавливаем сообщение об ошибке
    }

    return validationResult;
  };

  if (isAuth) {
    return <Navigate to={MAIN_ROUTE} />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography classes={{ root: styles.title }} variant="h5">
          Створення акаунту
        </Typography>

        <div className={styles.avatar}>
          <label>
            <input
              {...register("avatar", { validate: validateAvatar })}
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                setAvatarImage(file);
                setValue("avatar", file);
                register("avatar", { value: file });
              }}
              hidden
            />
            <Avatar
              alt="avatar"
              src={avatarImage ? URL.createObjectURL(avatarImage) : null}
              sx={{ width: 100, height: 100 }}
              style={{ cursor: "pointer" }}
            />
          </label>
          <Typography
            variant="body2"
            color={
              avatarMessage === "Некоректний формат зображення"
                ? "error"
                : "rgba(0, 0, 0, 0.55)"
            }
            mb={"6px"}
            className={styles.error}
          >
            {avatarMessage}
          </Typography>
        </div>
        <TextField
          label="Повне ім'я"
          className={styles.field}
          error={Boolean(errors.name?.message)}
          helperText={errors.name?.message}
          {...register("name", { required: "Вкажіть ім'я" })}
          fullWidth
        />
        <TextField
          label="E-Mail"
          className={styles.field}
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register("email", { required: "Вкажіть пошту" })}
          fullWidth
        />
        <TextField
          label="Пароль"
          className={styles.field}
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register("password", { required: "Вкажіть пароль" })}
          fullWidth
        />

        {formError && (
          <Typography variant="body2" color="error" mb={"6px"} className={styles.error}>
            {formError}
          </Typography>
        )}
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Зареєструватися
        </Button>

        <Link className={styles.link} to={LOGIN_ROUTE}>
          Вже зареєстрований
        </Link>
      </form>
    </Paper>
  );
}

export default Registration;
