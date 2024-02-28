import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import DeleteIcon from "@mui/icons-material/Clear";
import "easymde/dist/easymde.min.css";
import styles from "./Redactor.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { MAIN_ROUTE, POSTFILES_ROUTE, POST_ROUTE, SERVER_URL } from "../../utils/const";
import { selectIsAuth } from "../../redux/slices/auth";
import { IconButton, Input, Typography } from "@mui/material";
import axios from "../../axios";

const Redactor = () => {
  const isAuth = useSelector(selectIsAuth);
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("POST ID: ", id);
  let [img, setImg] = useState(null);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [ingredients, setIngredients] = useState([]);

  const [formError, setFormError] = useState("");

  const inputFileRef = useRef(null);

  const handleChangeFile = async (e) => {
    const file = e.target.files[0];
    setImg(file);
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", number: Date.now() }]);

    console.log("ingredients: ", ingredients);
  };
  const removeIngredient = (number) => {
    setIngredients(ingredients.filter((i) => i.number !== number));
    console.log("click");
  };
  const changeIngredient = (key, value, number) => {
    setIngredients(ingredients.map((i) => (i.number === number ? { ...i, [key]: value } : i)));
  };

  useEffect(() => {
    return () => {
      if (img) {
        URL.revokeObjectURL(img);
      }
    };
  }, [img]);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  const submitPost = async () => {
    const formData = new FormData();

    // Добавляем поля формы в FormData
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("img", img);
    formData.append("ingredients", JSON.stringify(ingredients));
    formData.append("text", text);
    youtubeUrl && formData.append("youtubeUrl", youtubeUrl);

    if (title && subtitle && img && ingredients.length > 0 && text) {
      if (id) {
        try {
          await axios.patch(`/post/${id}`, formData);
          navigate(`${POST_ROUTE}/${id}`);
        } catch (res) {
          setFormError("При оновлені поста сталася помилка.", res.message);
        }
      } else {
        try {
          const { data } = await axios.post("/post", formData);
          const newPostId = data._id;
          navigate(`${POST_ROUTE}/${newPostId}`);
        } catch (res) {
          setFormError("При публікації поста сталася помилка.", res.message);
        }
      }
    } else {
      return setFormError("Не всі поля заповнені або завантажений файл не є зображенням");
    }
  };

  useEffect(() => {
    if (id) {
      axios.get(`/post/${id}`).then((res) => {
        setTitle(res.data.post.title);
        setSubtitle(res.data.post.subtitle);
        setText(res.data.post.text);
        setYoutubeUrl(res.data.post.youtubeUrl);
        setIngredients(res.data.ingredients);

        axios
          .get(`${SERVER_URL}${POSTFILES_ROUTE}/${res.data.post.img}`, {
            responseType: "blob",
          })
          .then((response) => {
            const blob = response.data;
            const filename = "image.jpg"; // or whatever filename you prefer
            const file = new File([blob], filename, { type: blob.type });
            setImg(file);
          })
          .catch((error) => {
            console.error("Error loading image:", error);
          });
      });
    }
  }, []);

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to={MAIN_ROUTE} />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        {img ? "Змінити зображення" : "Завантажити зображення"}
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {/* {img && (
        <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Удалить
        </Button>
      )} */}

      {img && <img className={styles.image} src={URL.createObjectURL(img)} alt="Uploaded" />}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        variant="standard"
        placeholder="Заголовок статті..."
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        variant="standard"
        placeholder="Підзаголовок"
        fullWidth
      />
      <TextField
        style={{ marginTop: "20px" }}
        classes={{ root: styles.tags }}
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        variant="standard"
        placeholder="Посилання на YouTube відео (не обов'язково)"
        fullWidth
      />

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div>
          <Button variant="outlined" onClick={addIngredient} style={{ marginTop: "20px" }}>
            Додати інгредієнти
          </Button>
        </div>
        <div>
          {ingredients.map((i) => {
            return (
              <div style={{ display: "flex", gap: "20px" }} key={i.number}>
                <Input
                  value={i.name}
                  onChange={(e) => changeIngredient("name", e.target.value, i.number)}
                  type="text"
                  placeholder="Назва інгредієнту"
                ></Input>
                <Input
                  value={i.quantity}
                  onChange={(e) => changeIngredient("quantity", e.target.value, i.number)}
                  type="text"
                  placeholder="Кількість інгредієнту"
                ></Input>
                <IconButton onClick={() => removeIngredient(i.number)} color="red">
                  <DeleteIcon />
                </IconButton>
              </div>
            );
          })}
        </div>
      </div>

      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />

      {formError && (
        <Typography color="error" mb={"6px"} className={styles.error}>
          {formError}
        </Typography>
      )}

      <div className={styles.buttons}>
        <Button onClick={submitPost} size="large" variant="contained">
          {id ? "Обновити" : "Опубліковати"}
        </Button>
        <Link to={id ? `${POST_ROUTE}/${id}` : MAIN_ROUTE}>
          <Button size="large">Скасувати</Button>
        </Link>
      </div>
    </Paper>
  );
};

export default Redactor;
